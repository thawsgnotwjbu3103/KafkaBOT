import { Misc } from '@/helpers/constants';
import { EmbedBuilder, Message } from 'discord.js';

export class EmbedMisc {
    public static EmbedRandom(message: Message, displayString: string, value: any) {
        return new EmbedBuilder()
            .setColor(Misc.PRIMARY_EMBED_COLOR)
            .addFields({
                name: `Options: ${displayString}`,
                value: `\`\`\`My pick is: ${value}\`\`\``,
            })
            .setTimestamp()
            .setFooter({
                text: message.client.user.username,
                iconURL: message.client.user.displayAvatarURL(),
            });
    }
}
