import { Command } from '../../Interfaces';
import { guildsSchema as Schema } from '../../Models/guilds';

export const command: Command = {
    name: 'logchannel',
    options: [
        {
            name: 'set',
            description: 'Enable this module and choose a channel for it',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel you want to set as the logs channel',
                    type: 'CHANNEL',
                    required: true
                }
            ]
        },
        {
            name: 'disable',
            description: 'Disable this module in the server',
            type: 'SUB_COMMAND'
        }
    ],
    description: 'Helps the administrators of the guild to configure the logs channel module',
    async execute(interaction, client) {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        const action = interaction.options.getSubcommand(true);

        if(action === 'set') {
            const newChannel = interaction.options.getChannel("channel")?.id;
            Schema.findOne({ guild: interaction.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema().save();
                } else {
                    data.channels.logging = newChannel;
                    data.save();
                }
            });

            return interaction.reply({ content: `Your moderation logs channel has been updated to <#${newChannel}>`, ephemeral: true });
        } else if(action === 'disable') {
            Schema.findOne({ guild: interaction.guild.id }, async(err, data) => {
                if(!data) {
                    new Schema().save();
                } else {
                    data.channels.logging = 'disabled';
                    data.save();
                }
            });

            return interaction.reply({ content: `The moderation logs channel module has been disabled`, ephemeral: true });
        }
    }
}