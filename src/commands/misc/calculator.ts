import { Misc } from '@/helpers/constants';
import { EmbedBuilder, Message } from 'discord.js';
import axios from 'axios';
import { CustomCommandType } from '@/interfaces/command';

const Calculator: CustomCommandType  =  {
    name: '=',
    async execute(message: Message, parameters: string[]) {
        const expression = parameters[0]; // only get the first item to evaluate
        const result = await axios({ url: `${Misc.MATH_JS_API}/?expr=${encodeURIComponent(expression)}`, method: "GET"})
        const embed = new EmbedBuilder()
            .setColor(Misc.PRIMARY_EMBED_COLOR)
            .addFields({
                name: `Calculator`,
                value: `\`\`\` ${expression} = ${result.data} \`\`\``,
            })
            .setTimestamp()
            .setFooter({
                text: message.client.user.username,
                iconURL: message.client.user.displayAvatarURL(),
            });

        await message.reply({ embeds: [embed] });
    },
};

export default Calculator
