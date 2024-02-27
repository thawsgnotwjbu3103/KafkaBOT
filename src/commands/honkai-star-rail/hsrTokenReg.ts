import { CommandType } from '@/interfaces/command';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import HSRToken from '@/models/hsrTokenModel';

// this command basically get ltoken_v2 and ltuid_v2 from input and insert it to database, nothing too complicated
const HSRTokenReg: CommandType = {
    data: new SlashCommandBuilder()
        .setName('hsrtokenreg')
        .setDescription("Register Hoyoverse's token")
        .addStringOption((options) =>
            options.setName('ltoken_v2').setDescription("User's ltoken_v2").setRequired(true)
        )
        .addStringOption((options) =>
            options.setName('ltuid_v2').setDescription("User's ltuid_v2").setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const ltokenV2 = interaction.options.get('ltoken_v2');
        const ltuidV2 = interaction.options.get('ltuid_v2');

        if (!ltokenV2 || !ltuidV2) {
            await interaction.reply('Please enter ltoken_v2 and ltuid_v2 correctly!');
            return;
        }

        const user = await HSRToken.findOne({ userDiscordId: interaction.user.id, ltokenV2: ltokenV2 });
        if (user) {
            await interaction.reply('You are already enter the token, no need to do it again!');
            return;
        }

        await HSRToken.create({
            userDiscordId: interaction.user.id,
            ltokenV2: ltokenV2,
            ltuidV2: ltuidV2,
            isCron: false,
        });

        await interaction.reply('Register success!');
    },
};

export default HSRTokenReg;
