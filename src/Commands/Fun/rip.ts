import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'rip',
    type: 'bot',
    category: 'Fun',
    
    description: 'R.I.P. someone',
    run: async(client, args, interaction) => {
        let avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
        if(interaction.options.getUser("user")) avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.rip(avatar);
        let attachment = new MessageAttachment(image, "rip.png");
        return interaction.reply({ files: [attachment] });
    }
}