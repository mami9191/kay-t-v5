const moment = require("moment");
require("moment-duration-format");
const messageGuild = require("../../schemas/messageGuild");
const messageGuildChannel = require("../../schemas/messageGuildChannel");
const voiceGuild = require("../../schemas/voiceGuild");
const voiceGuildChannel = require("../../schemas/voiceGuildChannel");
const messageUser = require("../../schemas/messageUser");
const voiceUser = require("../../schemas/voiceUser");
const regstats = require("../../schemas/registerStats");
const db = require("../../schemas/inviter");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
module.exports = {
    conf: {
      aliases: ["tpstats","tops"],
      name: "topstats",
      help: "topstats"
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
   
    var sescat = new MessageButton()
  .setCustomId("ses")
  .setLabel("Top Ses Verileri")
  .setEmoji(`????`)
  .setStyle("DANGER")

    var mescat = new MessageButton()
    .setCustomId("mes")
    .setLabel("Top Mesaj Verileri")
    .setEmoji(`????`)
    .setStyle("DANGER")

    var main = new MessageButton()
  .setCustomId("topdavet")
  .setLabel("Top Davet Verileri")
  .setEmoji(`????`)
  .setStyle("DANGER")

  var topteyit = new MessageButton()
  .setCustomId("topteyit")
  .setLabel("Top Kay??t Verileri")
  .setEmoji(`???`)
  .setStyle("DANGER")

    const row = new MessageActionRow()
    .addComponents([main, sescat, mescat, topteyit]);
   
    embed.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) }).setTimestamp().setColor(message.author.displayHexColor).setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true })}).setThumbnail(message.guild.iconURL({ dynamic: true }))
     embed.setDescription(`A??a????da Olu??an Butonlardan **Ramalin ask botu** Sunucusunun Genel ??statistik Tablosuna Ula??abilirsin!
`)
    let msg = await message.channel.send({ embeds: [embed], components: [row]})

    var filter = (xd) => xd.user.id === message.author.id;
    let collector =  msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 99999999 })
  
collector.on("collect", async (button) => {
if(button.customId === "ses") {
  await button.deferUpdate();
  
const embeds = new MessageEmbed()
.addField(`**Genel Ses S??ralamas??** (\`Toplam ${moment.duration(voiceGuildData ? voiceGuildData.topStat : 0).format("H [saat], m [dakika]")}\`)`,`${voiceUsers.length > 0 ? voiceUsers : "Veri Bulunmuyor."}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
msg.edit({
embeds: [embeds],
components : [row]
})}
if(button.customId === "mes") {
  await button.deferUpdate();

const embeds = new MessageEmbed()
.addField(`**Genel Chat S??ralamas??** (\`Toplam ${Number(messageGuildData ? messageGuildData.topStat : 0).toLocaleString()} mesaj\`)`,`${messageUsers.length > 0 ? messageUsers : "Veri Bulunmuyor."}`).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 })})
msg.edit({
embeds: [embeds],
components : [row]
})}
if(button.customId === "topdavet") {
  await button.deferUpdate();

  let data = await db.find({ guildID: message.guild.id }).sort({ total: -1 });
  if (!data.length)return message.channel.send({ embeds: [embed.setDescription("Herhangi bir invite verisi bulunamad??!")] });
  let arr = [];
  data.forEach((x) => arr.push({ id: x.userID, total: x.total }));
  let index = arr.findIndex((x) => x.id == message.author.id) + 1;

  let list = data
    .filter((x) => message.guild.members.cache.has(x.userID))
    .splice(0, 10)
    .map((x, index) => `${x.userID === message.author.id ? `**${index + 1}. <@${x.userID}> - Toplam ${x.total} davet (${x.regular} ger??ek, ${x.bonus} bonus, ${x.fake} fake, ${x.leave} ayr??lm????)**` : `**${index + 1}.** <@${x.userID}> - Toplam **${x.total}** davet \`(${x.regular} ger??ek, ${x.bonus} bonus, ${x.fake} fake, ${x.leave} ayr??lm????)\``}`)
    .join("\n");

  const veri = await db.findOne({ guildID: message.guild.id, userID: message.author.id });
  if (index < 10) {
    const embed = new MessageEmbed()
    .setAuthor({ name: "Invite S??ralamas??" })
    .setDescription(list);
    message.channel.send({ embeds: [embed]});
  } else {
    const embed = new MessageEmbed()
    .setAuthor({ name: "Invite S??ralamas??" })
    .addField(`Invite S??ralamas?? (\`${list} \n... \n**${index}. ${message.author} Toplam ${veri.total} davet (${veri.regular} ger??ek, ${veri.bonus} bonus, ${veri.fake} fake, ${veri.leave} ayr??lm????)**`);
    message.channel.send({ embeds: [row]});
  }


  msg.edit({
embeds: [embed],
components : [row]
})}
if(button.customId === "topteyit") {
    await button.deferUpdate();
  
    let registerTop = await regstats.find({ guildID: message.guild.id }).sort({ top: -1 });

    if (!registerTop.length) 
    {
    message.reply({ content:"Herhangi bir kay??t verisi bulunamad??!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    registerTop = registerTop.filter((x) => message.guild.members.cache.has(x.userID)).splice(0, 30);

    message.reply({ embeds: [embed.setDescription((registerTop.map((x, i) => `\` ${i + 1} \` <@${x.userID}> - Erkek __${x.erkek}__ Kad??n __${x.k??z}__`)).join("\n"))] });
  msg.edit({
  embeds: [embeds],
  components : [row]
  })}
})
},
  };
  
  