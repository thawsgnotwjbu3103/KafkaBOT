import { Misc } from '@/helper/constant';
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Hercai } from 'hercai';

export default [
    {
        data: new SlashCommandBuilder()
            .setName('chat')
            .setDescription('Chat with AI')
            .addStringOption((options) => options.setName('question').setDescription('Ask me anything...').setRequired(true)),
        async execute(interaction: CommandInteraction) {
            await interaction.deferReply();
            const herc = new Hercai();
            const question = interaction.options.get('question', true);
            if (!question.value) {
                await interaction.followUp('❌ Invalid input');
                return;
            }

            const response = await herc.question({ model: 'v3', content: question.value as string });
            const embed = new EmbedBuilder()
                .setColor(Misc.PRIMARY_EMBED_COLOR)
                .setDescription(`** ${interaction.user.displayName} asked **: ${response.content} \n ** KafkaBOT **: ${response.reply}`)
                .setTimestamp()
                .setFooter({ text: 'KafkaBOT - Chat with AI', iconURL: interaction.client.user.avatarURL() || '' });

            await interaction.followUp({ embeds: [embed] });
            return;
        },
    },
    {
        data: new SlashCommandBuilder()
            .setName('draw')
            .setDescription('Ask AI to draw a image')
            .addStringOption((options) => options.setName('idea').setDescription('Give me an idea...').setRequired(true)),
        async execute(interaction: CommandInteraction) {
            await interaction.deferReply();
            const herc = new Hercai();
            const idea = interaction.options.get('idea', true);
            if (!idea.value) {
                await interaction.followUp('❌ Invalid input');
                return;
            }

            const response = await herc.drawImage({
                model: 'animefy',
                prompt: idea.value as string,
                negative_prompt: Misc.NEGATIVE_PROMPTS.join(','),
            });
            
            const embed = new EmbedBuilder()
                .setColor(Misc.PRIMARY_EMBED_COLOR)
                .setDescription(
                    `** ${interaction.user.displayName}'s idea**: ${response.prompt} 
                    \n** KafkaBOT's response **: Here is your [${response.prompt}](${response.url})`
                )
                .setImage(response.url)
                .setTimestamp()
                .setFooter({ text: 'KafkaBOT - Chat with AI', iconURL: interaction.client.user.avatarURL() || '' });

            await interaction.followUp({ embeds: [embed] });
            return;
        },
    },
];
