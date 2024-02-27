import { Misc } from '@/helpers/constants';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } from 'discord.js';
import { CustomCommandType } from '@/interfaces/command';
import { Utils } from '@/helpers/utils';
import { EmbedMisc } from '@/embeds/embedMisc';

const Random: CustomCommandType = {
    name: 'rd',
    async execute(message: Message, parameters: string[]) {
        if (parameters.length <= 0) {
            (await message.reply('Options must be at least 2 items minimum!')).react('❌');
            return;
        }

        let displayString = parameters.join(' , ');
        const item = parameters[0];
        if (parameters.length == 1 && item.includes('..')) {
            const [startNum, endNum] = item.split('..');
            if (!startNum || !endNum || isNaN(Number(startNum)) || isNaN(Number(endNum))) {
                (await message.reply('Invalid range provided!')).react('❌');
                return;
            }

            displayString = `From ${item.replace('..', ' to ')}`;
            parameters = Utils.createArray(Number(startNum), Number(endNum));
        }

        if (!parameters.length) {
            (await message.reply('Invalid input!')).react('❌');
            return;
        }

        const selectedValue = parameters[Math.floor(Math.random() * parameters.length)];

        const reroll = new ButtonBuilder()
            .setCustomId('reroll-rd')
            .setLabel('🔁')
            .setStyle(ButtonStyle.Primary);

        const buttonRow = new ActionRowBuilder<ButtonBuilder>().setComponents([reroll]);
        const reply = await message.reply({
            embeds: [EmbedMisc.EmbedRandom(message, displayString, selectedValue)],
            components: [buttonRow],
        });

        const collector = reply.createMessageComponentCollector({
            time: Misc.TIME_COLLECTOR,
        });

        collector.on('collect', async (interact) => {
            if (interact.user.id !== message.author.id) return;
            if (interact.customId == 'reroll-rd') {
                const rerollValue = parameters[Math.floor(Math.random() * parameters.length)];
                await Promise.all([
                    reply.edit({
                        embeds: [EmbedMisc.EmbedRandom(message, displayString, rerollValue)],
                        components: [buttonRow],
                    }),
                    interact.update({
                        embeds: [EmbedMisc.EmbedRandom(message, displayString, rerollValue)],
                        components: [buttonRow],
                    }),
                ]);
            }
        });
    },
};

export default Random;
