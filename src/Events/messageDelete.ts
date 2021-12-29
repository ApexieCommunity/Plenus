import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { moderationLogsCollection as logsCollection } from '../Collections';

export const event: Event = {
    name: 'messageDelete',
    run: async(client, message: Message) => {
        const logsChannel = client.channels.cache.find(ch => ch.id === logsCollection.get(message.guild.id));
        if(!logsChannel) return;
        if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
        let logs = await message.guild.fetchAuditLogs({type: 72});
        let entry = logs.entries.first();
        let reason;
        if(entry.executor === message.author) {
            reason = "Deleted by message author";
        } else if(entry.executor === client.user) {
            return;
        } else {
            reason = "Deleted by " + `<@${entry.executor.id}>`;
        }
        logsChannel.send({ embeds: [
            new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(client.config.colors.negative)
                .setTitle('Message Deleted')
                .setDescription(
                    `**❯ Reason:** ${reason}\n` +
                    `**❯ Channel:** <#${message.channel.id}>\n` +
                    `\n**❯ Deleted Message:** ${message.content}`
                )
                .setTimestamp()
        ] });
    }
}