const Discord = require("discord.js");
const moment = require("moment-timezone");
const sortBy = require("lodash.sortby");

const execute = async ({ msg, Price }) => {
  let allPrices;
  const currentTime = moment().tz(process.env.TIMEZONE);
  try {
    allPrices = await Price.find({}).exec();
  } catch (err) {
    console.error(err);
  }

  const isSunday = currentTime.format("dddd") === "Sunday";

  const todaysPrices = allPrices.filter(
    ({ date }) =>
      moment(date).format("MM/D/YYYY") === currentTime.format("MM/D/YYYY")
  );

  const bestPrice = sortBy(todaysPrices, ["price"]).map(
    obj => (obj.price = parseInt(obj.price))
  )[todaysPrices.length - 1];

  const embed =
    todaysPrices.length > 0
      ? isSunday
        ? new Discord.MessageEmbed()
            .setTitle(
              `Today's Turnips (${moment(bestPrice.date).format("MM/D/YYYY")})`
            )
            .setColor(0x00ae86)
            .setThumbnail(
              "https://vignette3.wikia.nocookie.net/animalcrossing/images/b/b7/Turnip.png/revision/latest?cb=20100726212427"
            )
            .setTimestamp()
            .addField(
              "**Best Price**",
              `${bestPrice.price} by ${bestPrice.user} [${bestPrice.timing}]`
            )
            .addField(
              "**All Prices**",
              todaysPrices
                .map(data => `${data.price} by ${data.user}`)
                .join("\n")
            )
        : new Discord.MessageEmbed()
            .setTitle(
              `Today's Turnips (${moment(bestPrice.date).format("MM/D/YYYY")})`
            )
            .setColor(0x00ae86)
            .setThumbnail(
              "https://vignette3.wikia.nocookie.net/animalcrossing/images/b/b7/Turnip.png/revision/latest?cb=20100726212427"
            )
            .setTimestamp()
            .addField(
              "**Best Price**",
              `${bestPrice.price} by ${bestPrice.user} (${bestPrice.timing})`
            )
            .addField(
              "**Morning Prices**",
              todaysPrices.filter(item => item.timing === "Morning").length > 0
                ? todaysPrices
                    .filter(item => item.timing === "Morning")
                    .map(
                      data => `${data.price} by ${data.user} (${data.timing})`
                    )
                    .join("\n")
                : "No morning prices today yet!"
            )
            .addField(
              "**Afternoon Prices**",
              todaysPrices.filter(item => item.timing === "Afternoon").length >
                0
                ? todaysPrices
                    .filter(item => item.timing === "Afternoon")
                    .map(
                      data => `${data.price} by ${data.user} (${data.timing})`
                    )
                    .join("\n")
                : "No afternoon prices today yet!"
            )
      : "No prices recorded today yet! Use `stalk! help` for commands to register prices";

  msg.channel.send(embed);
};

module.exports = {
  name: "today",
  description: "Shows todays stats for stalk tracker",
  execute
};
