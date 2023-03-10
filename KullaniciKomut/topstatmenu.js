const moment = require("moment");
require("moment-duration-format");
const messageGuild = require("../../schemas/messageGuild");
const messageGuildChannel = require("../../schemas/messageGuildChannel");
const voiceGuild = require("../../schemas/voiceGuild");
const voiceGuildChannel = require("../../schemas/voiceGuildChannel");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
module.exports = {
    conf: {
      aliases: ["topstat","ts"],
      name: "ramalcik",
      help: "ramalcik"
    },
  
run: async (client, message, args, embed, prefix) => {
    const messageChannelData = await messageGuildChannel.find({ guildID: message.guild.id }).sort({ channelData: -1 });
    const voiceChannelData = await voiceGuildChannel.find({ guildID: message.guild.id }).sort({ channelData: -1 });
    const messageUsersData = await messageUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
    const voiceUsersData = await voiceUser.find({ guildID: message.guild.id }).sort({ topStat: -1 });
    const messageGuildData = await messageGuild.findOne({ guildID: message.guild.id });
    const voiceGuildData = await voiceGuild.findOne({ guildID: message.guild.id });
    const messageChannels = messageChannelData.splice(0, 15).map((x, index) => `\`${index+1}.\` <#${x.channelID}>: \`${Number(x.channelData).toLocaleString()} mesaj\``).join(`\n`);
    const voiceChannels = voiceChannelData.splice(0, 15).map((x, index) => `\`${index+1}.\` <#${x.channelID}>: \`${moment.duration(x.channelData).format("H [saat], m [dakika]")}\``).join(`\n`);
    const messageUsers = messageUsersData.splice(0, 10).map((x, index) => `\`${index+1}.\` <@${x.userID}>: \`${Number(x.topStat).toLocaleString()} mesaj\``).join(`\n`);
    const voiceUsers = voiceUsersData.splice(0, 10).map((x, index) => `\`${index+1}.\` <@${x.userID}>: \`${moment.duration(x.topStat).format("H [saat], m [dakika]")}\``).join(`\n`);
    
    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setPlaceholder('L??tfen a??a????dan se??im yap??n??z.')
          .setCustomId('kurulumselect')
          .addOptions([
          { 
              label: "Ses ??statisti??i",
              description: "Sunucudaki ses verilerini ????ren.",
              value: "topses",
              emoji: "945431043853402192"

          },
          { 
            label: "Mesaj ??statisti??i",
            description: "Sunucudaki mesaj verilerini ????ren.",
            value: "topmesaj",
            emoji: "945431043853402192"

          },
          { 
            label: "Kapat",
            description: "Men??y?? Kapat.",
            value: "closeMenu",
            emoji: "???"
          }
        ])
        );


        embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) }).setTimestamp().setColor(message.author.displayHexColor).setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })}).setThumbnail(message.guild.iconURL({ dynamic: true }))
      embed.setDescription(`Merhaba ${message.author}, a??a????da bulunan men??den 30 saniye i??erisinde incelemek istedi??iniz veriyi se??in.`)

            let msg = await message.channel.send({ components: [row], embeds: [embed] })
            message.react(`${client.emojis.cache.find(x => x.name === "green")}`);
             msg.awaitMessageComponent({ filter: (component) => component.user.id === message.author.id, componentType: 'SELECT_MENU',}).then(async (interaction) => {
             if(interaction.values[0] == "topmesaj") {
                embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
     .setThumbnail(message.guild.iconURL({ dynamic: true }))
     .setDescription(`
${client.emojis.cache.find(x => x.name === "ramallink")} Merhaba ${message.author}, a??a????da listelenmi?? verileri inceleyip sunucunun mesaj istatistiklerini ????renebilirsin.
    `)
    .addField(`${client.emojis.cache.find(x => x.name === "ramalstat")} **Mesaj Kanallar??n??n ??statistikleri**`,`${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`,true)

            interaction.update({ components: [row], embeds: [embed] }).then(e => setTimeout(() => interaction.message.delete().catch(() => { }), 30000))}		 
             if(interaction.values[0] == "topses") {
                embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
     .setThumbnail(message.guild.iconURL({ dynamic: true }))
     .setDescription(`
${client.emojis.cache.find(x => x.name === "ramallink")} Merhaba ${message.author}, a??a????da listelenmi?? verileri inceleyip sunucunun ses istatistiklerini ????renebilirsin.
    `)
    .addField(`${client.emojis.cache.find(x => x.name === "ramalstat")} **Ses Kanallar??n??n ??statistikleri**`,`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`,true)

                interaction.update({ components: [row], embeds: [embed] }).then(e => setTimeout(() => interaction.message.delete().catch(() => { }), 30000))}
                if(interaction.values[0] == "InviteRegisterStat") {
                
                    embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
     .setThumbnail(message.guild.iconURL({ dynamic: true }))
     .setDescription(`
${client.emojis.cache.find(x => x.name === "ramallink")} Merhaba ${message.author}, a??a????da listelenmi?? verileri inceleyip sunucunun ses istatistiklerini ????renebilirsin.
    `)
    .addField(`${client.emojis.cache.find(x => x.name === "ramalstat")} **Mesaj Kanallar??n??n ??statistikleri**`,`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`,true)
    
                    interaction.update({ components: [row], embeds: [embeds] }).then(e => setTimeout(() => interaction.message.delete().catch(() => { }), 30000))
                }                                
                    if(interaction.values[0] == "closeMenu") {
                        interaction.message.delete()					
                        }
                

                    
                
                    })

}
}