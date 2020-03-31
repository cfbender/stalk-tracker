const fs = require("fs-extra");
const Discord = require("discord.js");
const moment = require("moment-timezone");
const execute = async (msg, args) => {
  let stats;

  try {
    stats = await fs.readJson("./data.json");
    console.log("data.json read in");
  } catch (err) {
    console.error(err);
  }

  const embed =
    moment()
      .tz(process.env.TIMEZONE)
      .format("dddd") === "Sunday"
      ? new Discord.MessageEmbed()
          .setTitle(`Today's Turnips (${stats.today.date})`)
          .setColor(0x00ae86)
          .setThumbnail(
            "https://vignette3.wikia.nocookie.net/animalcrossing/images/b/b7/Turnip.png/revision/latest?cb=20100726212427"
          )
          .setTimestamp()
          .addField(
            "**Best Price**",
            `${stats.today.bestPrice.value} by ${stats.today.bestPrice.user} (${stats.today.bestPrice.type})`
          )
          .addField(
            "**All Prices**",
            stats.today.allPrices.length > 0
              ? stats.today.allPrices
                  .map(data => `${data.value} by ${data.user} (${data.type})`)
                  .join("\n")
              : "No prices today yet!"
          )
      : new Discord.MessageEmbed()
          .setTitle(`Today's Turnips (${stats.today.date})`)
          .setColor(0x00ae86)
          .setThumbnail(
            "https://vignette3.wikia.nocookie.net/animalcrossing/images/b/b7/Turnip.png/revision/latest?cb=20100726212427"
          )
          .setTimestamp()
          .addField(
            "**Best Price**",
            `${stats.today.bestPrice.value} by ${stats.today.bestPrice.user} (${stats.today.bestPrice.type})`
          )
          .addField(
            "**Morning Prices**",
            stats.today.allPrices.filter(item => item.type === "Nook (Morning)")
              .length > 0
              ? stats.today.allPrices
                  .filter(item => item.type === "Nook (Morning)")
                  .map(data => `${data.value} by ${data.user} (${data.type})`)
                  .join("\n")
              : "No morning prices today yet!"
          )
          .addField(
            "**Afternoon Prices**",
            stats.today.allPrices.filter(
              item => item.type === "Nook (Afternoon)"
            ).length > 0
              ? stats.today.allPrices
                  .filter(item => item.type === "Nook (Afternoon)")
                  .map(data => `${data.value} by ${data.user} (${data.type})`)
                  .join("\n")
              : "No afternoon prices today yet!"
          );

  msg.channel.send(embed);
};

module.exports = {
  name: "today",
  description: "Shows todays stats for stalk tracker",
  execute
};
