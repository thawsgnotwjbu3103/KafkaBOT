import Hoyoverse from '@/entity/hoyoverse';
import { AppDataSource } from '@/helper/datasource';
import { Utils } from '@/helper/util';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export default [
    {
        data: new SlashCommandBuilder()
            .setName('kfhoyo')
            .setDescription('Assign your Hoyolab cookie')
            .addStringOption((options) => options.setName('cookie').setDescription('Your Hoyolab cookie').setRequired(true)),
        execute: async (interaction: CommandInteraction) => {
            await interaction.deferReply();
            const option = interaction.options.get('cookie', true);
            if (!option.value) {
                await interaction.followUp('❌ Invalid parameters');
                return;
            }

            const cookie = option.value as string;
            const userDiscordId = interaction.user.id;
            const repository = AppDataSource.getRepository(Hoyoverse);

            try {
                const entity = new Hoyoverse();
                entity.userDiscordId = userDiscordId;
                entity.cookie = cookie;
                entity.lastUpdated = Utils.dateToInt(new Date());
                await repository.insert(entity);
                await interaction.followUp({ content: '✅ Assign successfully !', ephemeral: true });
                return;
            } catch (error) {
                await interaction.followUp('❌ Something wrong happened');
                return;
            }
        },
    },
];
