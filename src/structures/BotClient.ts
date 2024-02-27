import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
import { CommandType, CustomCommandType } from '@/interfaces/command';
import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import mongoose from 'mongoose';
import { glob } from 'glob';
import path from 'path';
import url from 'url';

class BotClient extends Client {
    private commands = new Collection<string, CommandType>();
    private customCommands = new Collection<string, CustomCommandType>();
    private readonly NODE_ENV = process.env.NODE_ENV;
    private readonly MONGOCONNSTR_ = process.env.MONGOCONNSTR_;
    private readonly COMMAND_PREFIX = process.env.COMMAND_PREFIX;
    private readonly INDEX_FOR_REMOVE = 1; // prefix index to slice in message content
    private readonly COMMAND_NAME_INDEX = 0; // index after slice, using first word as command name
    private readonly DISCORD_CLIENT_TOKEN = process.env.CLIENT_TOKEN;
    private readonly DISCORD_CLIENT_ID = process.env.CLIENT_ID;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
            ],
        });
    }

    public async run() {
        await this.dbConnection();
        await this.registerModules();
    }

    private async registerModules() {
        this.commands = new Collection();
        this.customCommands = new Collection();

        // find all command files in commands folder and read it's content
        const commandFiles = await glob(`${path.resolve(__dirname, '../commands')}/*/*{.ts,.js}`, {
            windowsPathsNoEscape: true,
        });

        const commands: any[] = [];

        await Promise.all(
            commandFiles.map(async (filePath) => {
                const importedFile = await this.importFile(url.pathToFileURL(filePath).href);

                let command = this.NODE_ENV === 'development' ? importedFile : importedFile.default;

                if ('data' in command && 'execute' in command) {
                    this.commands.set(command.data.name, command);
                    commands.push(
                        command.default ? command.default.data.toJSON() : command.data.toJSON()
                    );
                } else if ('name' in command && 'execute' in command) {
                    this.customCommands.set(command.name, command);
                } else {
                    console.log(
                        `[WARNING] The command at ${filePath} is missing required properties.`
                    );
                }
            })
        );

        this.once('ready', (cl) => {
            if (!cl.user) return;
            console.log(`Ready! logged in as ${cl.user.tag}`);
        });

        // register commands
        this.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            if (!interaction.guild) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp('You cannot use slash commands in DM!');
                    return;
                }
                await interaction.reply('You cannot use slash commands in DM!');
                return;
            } // prevent command call in DM
            const client = interaction.client as BotClient;
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.log(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp('There was an error while executing this command!');
                    return;
                }
                await interaction.reply('There was an error while executing this command!');
                return;
            }
        });

        // register custom commands
        this.on('messageCreate', async (message) => {
            if (!message.guild) return; // prevent command call in DM
            const content = message.content;
            if (!content.startsWith(this.COMMAND_PREFIX!!)) return;
            const removedPrefixContent = content.slice(this.INDEX_FOR_REMOVE); // remove prefix from string

            // split content to array
            const contentArray = removedPrefixContent.split(' ');

            // get first word as command name after remove prefix, to prevent multiple words in message
            const commandName = contentArray[this.COMMAND_NAME_INDEX] || null;

            // remove command name from current array
            contentArray.splice(0, this.INDEX_FOR_REMOVE);

            // assign remain items to parameter array
            const parameters = contentArray;

            if (!commandName) return;
            if (!parameters) return;

            const client = message.client as BotClient;
            const command = client.customCommands.get(commandName);
            if (!command) {
                console.error(`No command matching ${commandName} was found.`);
                return;
            }

            try {
                await command.execute(message, parameters);
            } catch (error) {
                console.log(error);
                await message.reply('There was an error while executing this command!');
                return;
            }
        });

        console.log(`Started refreshing ${this.commands.size} (/) commands.`);
        console.log(`Started refreshing ${this.customCommands.size} custom (/) commands.`);
        const rest = new REST({ version: '10' }).setToken(this.DISCORD_CLIENT_TOKEN!!);
        await rest.put(Routes.applicationCommands(this.DISCORD_CLIENT_ID!!), {
            body: commands,
        });
        this.login(this.DISCORD_CLIENT_TOKEN!!);
    }

    private async dbConnection() {
        await mongoose.connect(this.MONGOCONNSTR_!!);
        console.log('DB Connected');
    }

    private async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }
}

export default new BotClient();
