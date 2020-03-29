const fs = require("fs-extra");
const Discord = require("discord.js");

const execute = async (msg, args) => {
  let stats;

  try {
    stats = await fs.readJson("./data.json");
    console.log("data.json read in");
  } catch (err) {
    console.error(err);
  }

  const embed = new Discord.MessageEmbed()
    .setTitle("All Time Turnip Stats")
    .setColor(0x00ae86)
    .setThumbnail(
      "https://vignette3.wikia.nocookie.net/animalcrossing/images/b/b7/Turnip.png/revision/latest?cb=20100726212427"
    )
    .setTimestamp()
    .addField(
      "**Highest Nook Price Ever**",
      `${stats.highestNookPriceEver.value} on ${stats.highestNookPriceEver.date} from ${stats.highestNookPriceEver.user}`
    )
    .addField(
      "**Lowest Nook Price Ever**",
      `${stats.lowestNookPriceEver.value} on ${stats.lowestNookPriceEver.date} from ${stats.lowestNookPriceEver.user}`
    )
    .addField(
      "**Highest Daisy Price Ever**",
      `${stats.highestDaisyPriceEver.value} on ${stats.highestDaisyPriceEver.date} from ${stats.highestDaisyPriceEver.user}`
    )
    .addField(
      "**Lowest Daisy Price Ever**",
      `${stats.lowestDaisyPriceEver.value} on ${stats.lowestDaisyPriceEver.date} from ${stats.lowestDaisyPriceEver.user}`
    );

  msg.channel.send(embed);
};

module.exports = {
  name: "stats",
  description: "Shows all-time stats for stalk tracker",
  execute
};
