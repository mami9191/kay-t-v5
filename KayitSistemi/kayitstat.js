const { MessageEmbed } = require('discord.js');
const regstats = require("../../schemas/registerStats");
const serverSettings =require('../../models/sunucuayar')
const { red, green } = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: [],
    name: "teyitler",
    help: "teyitler"
  },
  run: async (client, message, args, embed, prefix) => {
    
    if (!message.guild) return;
    let ayar = await serverSettings.findOne({
      guildID: message.guild.id
  });

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has('ADMINISTRATOR')) 
    {
    message.react(red)
    message.reply({ content: `Yetkin bulunmamakta.\Yetkili olmak istersen başvurabilirsin.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (args[0] === "top") {
      let registerTop = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

      if (!registerTop.length) 
      {
      message.react(red)
      message.reply({ content:"Herhangi bir kayıt verisi bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
      return }
      registerTop = registerTop.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 30);
      message.react(green)

      message.reply({ embeds: [embed.setDescription((registerTop.map((x, i) => `\` ${i + 1} \` <@${x.userID}> - Erkek __${x.erkek}__ Kadın __${x.kız}__`)).join("\n"))] });

    } else if (!args[0]) {
      const data = await regstats.findOne({ guildID: message.guild.id, userID: member.id });
      message.react(green)
      message.reply({ embeds: [embed.setDescription(`  
Toplam kayıt bilgisi: \`${data ? data.top : 0}\`
Toplam erkek kayıt bilgisi: \`${data ? data.erkek : 0}\`
Toplam kız kayıt bilgisi: \`${data ? data.kız : 0}\`
	`)] });
    }
  },
};
