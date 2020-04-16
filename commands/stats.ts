import moment from "moment-timezone";
import Discord from "discord.js";
import sortBy from "lodash.sortby";
import { ExecuteFn } from "../commands";

const execute: ExecuteFn = async ({ msg, Price }) => {
  let allPrices;
  const timezone = process.env.TIMEZONE || "America/Denver"
  try {
    allPrices = await Price.find({}).exec();

    const nookPrices = sortBy(
      allPrices.filter(({ npc }) => npc === "Nook"),
      ["price"]
    );
    const highestNookPrice = nookPrices.slice(-1).pop() || nookPrices[0];
    const lowestNookPrice = nookPrices[0];

    const daisyPrices = sortBy(
      allPrices.filter(({ npc }) => npc === "Daisy"),
      ["price"]
    );
    const highestDaisyPrice = daisyPrices.slice(-1).pop() || daisyPrices[0];
    const lowestDaisyPrice = daisyPrices[0];

    const embed = new Discord.MessageEmbed()
      .setTitle("All Time Turnip Stats")
      .setColor(0x00ae86)
      .setThumbnail(
        "https://vignette3.wikia.nocookie.net/animalcrossing/images/b/b7/Turnip.png/revision/latest?cb=20100726212427"
      )
      .setTimestamp()
      .addField(
        "**Highest Nook Price Ever**",
        nookPrices.length > 0
          ? `${highestNookPrice.price} on ${moment(highestNookPrice.date).tz(timezone).format(
              "MM/D/YYYY"
            )} from ${highestNookPrice.user}`
          : "No Nook prices recorded yet!"
      )
      .addField(
        "**Lowest Nook Price Ever**",
        nookPrices.length > 0
          ? `${lowestNookPrice.price} on ${moment(lowestNookPrice.date).tz(timezone).format(
              "MM/D/YYYY"
            )} from ${lowestNookPrice.user}`
          : "No Nook prices recorded yet!"
      )
      .addField(
        "**Highest Daisy Price Ever**",
        daisyPrices.length > 0
          ? `${highestDaisyPrice.price} on ${moment(
              highestDaisyPrice.date
            ).tz(timezone).format("MM/D/YYYY")} from ${highestDaisyPrice.user}`
          : "No Daisy prices recorded yet!"
      )
      .addField(
        "**Lowest Daisy Price Ever**",
        daisyPrices.length > 0
          ? `${lowestDaisyPrice.price} on ${moment(
              lowestDaisyPrice.date
            ).tz(timezone).format("MM/D/YYYY")} from ${lowestDaisyPrice.user}`
          : "No Daisy prices recorded yet!"
      );

    msg.channel.send(embed);
  } catch (err) {
    console.error(err);
  }
};

export default {
  name: "stats",
  description: "Shows all-time stats for stalk tracker",
  execute,
};
