const Discord = require("discord.js");
const config = require("../../config.json");

exports.run = (client, member) => {
  //log new user
  var joinChannelID = config.joinLogChannel;
  var joinTime = new Date().toLocaleString("en-US", {timeZone: "America/New_York", timeZoneName: "short", weekday: "short", month: "long", day: "2-digit", year: "numeric", hour: '2-digit', minute:'2-digit'});

  var embed = new Discord.RichEmbed()
  .setColor(0x008000)
  .setDescription(`
${member.user} è entrato a far parte del server 
**Tag:** ${member.user.tag}
**ID:** ${member.user.id}
**Creato Il:** ${member.user.createdAt}
**Joinato Il: ** ${joinTime}
  `);
  client.channels.find("id", joinChannelID).send({embed}).catch(console.error);

  }