import { Misc } from '@/helpers/constants';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

export class HSREmbed {
    public static CheckinEmbed(interaction: CommandInteraction, displayString: string) {
        return new EmbedBuilder({
            title: "Honkai: Star Rail Auto Check-in",
            author: {
                name: "Honkai: Star Rail",
                icon_url: "https://i.imgur.com/o0hyhmw.png"
            },
            description: displayString,
            color: Misc.PRIMARY_EMBED_COLOR,
            timestamp: new Date(),
            footer: {
                text: "Honkai: Star Rail Auto Check-in",
                iconURL: interaction.user.displayAvatarURL()
            }
        })
    }
}
