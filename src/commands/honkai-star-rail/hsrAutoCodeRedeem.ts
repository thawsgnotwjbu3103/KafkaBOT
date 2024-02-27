import { CommandType } from '@/interfaces/command';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const HSRRedeem: CommandType = {
    data: new SlashCommandBuilder()
        .setName('hsrredeem')
        .setDescription('Auto redeem Honkai: Star Rail gift code')
        .addStringOption((options) =>
            options.setName('ltuid_v2').setDescription("User's ltuid_v2").setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('Ok');
        return;
    },
};

export default HSRRedeem;
