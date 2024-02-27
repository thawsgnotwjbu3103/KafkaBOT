import { CommandType } from '@/interfaces/command';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { HonkaiStarRail } from '@/helpers/constants';
import HSRToken from '@/models/hsrTokenModel';
import { CronJob } from 'cron';
import { HSREmbed } from '@/embeds/hsrEmbed';
import hsrCheckInRepository from '@/repositories/hsr/hsrCheckInRepository';

// this function basically call all required apis, then send message to user's DM
const setInteraction = async (
    userAgent: string,
    cookies: string,
    userId: string,
    interaction: CommandInteraction
) => {
    const [check, info, awards] = await Promise.all([
        hsrCheckInRepository.postCheckInApi({ userAgent, cookies }, userId),
        hsrCheckInRepository.getInfo({ userAgent, cookies }),
        hsrCheckInRepository.getAwards({ userAgent, cookies }),
    ]);

    console.log(check, info, awards)

    if (!check && (!awards.data || !info.data)) {
        await interaction.client.users.cache.get(userId)?.send({
            content: `Something happened! Please try again`,
        });
        return;
    }

    if (awards.data && info.data) {
        if (!check) {
            await interaction.client.users.cache.get(userId)?.send({
                content: `You are already checked in, Trailblazer~`,
            });
        } else {
            const infoItem = info.data;
            const awardItem = awards.data;
            let displayString = `Today's reward: ${awardItem.awards[infoItem.total_sign_day].name}`;

            displayString += ` x${awardItem.awards[infoItem.total_sign_day].cnt}`;
            displayString += `\n\rTotal signed: ${info.data.total_sign_day}`;

            await interaction.client.users.cache.get(userId)?.send({
                embeds: [HSREmbed.CheckinEmbed(interaction, displayString)],
            });
        }
    }
    return;
};

const HSRCheckIn: CommandType = {
    data: new SlashCommandBuilder().setName('hsrcheckin').setDescription('Start check-in schedule'),
    async execute(interaction: CommandInteraction) {
        const userId = interaction.user.id;
        const user = await HSRToken.findOne({ userDiscordId: userId, isCron: false });
        if (!user) {
            await interaction.reply('You are already set all accounts, no need to check~');
            return;
        }

        // get random user-agent from array
        const userAgent =
            HonkaiStarRail.HSR_USER_AGENTS[
                Math.floor(Math.random() * HonkaiStarRail.HSR_USER_AGENTS.length)
            ];

        const cookies = `ltoken_v2=${user.ltokenV2}; ltuid_v2=${user.ltuidV2}`;

        // call api for the first time to check if user already checked-in or not
        await setInteraction(userAgent, cookies, userId, interaction);

        // initialize cron job
        const job = new CronJob(HonkaiStarRail.HSR_CHECKIN_CRON_PATTERN, async () => {
            await setInteraction(userAgent, cookies, userId, interaction);
            return;
        });

        // start cron job and update the cron status to prevent duplicate
        job.start();

        await HSRToken.updateOne(
            {
                userDiscordId: userId,
                isCron: false,
                ltokenV2: user.ltokenV2,
                ltuidV2: user.ltuidV2,
            },
            { isCron: true }
        );
        await interaction.reply('Start auto check-in ✅');
        return;
    },
};

export default HSRCheckIn;
