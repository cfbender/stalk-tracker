const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports = async (msg, price, npc) => {
  price = parseInt(price);

  if (!price || isNaN(price)) {
    return msg.channel.send("You must give a price to register.");
  }

  let stats;

  try {
    stats = await fs.readJson("./data.json");
    console.log("data.json read in");
  } catch (err) {
    console.error(err);
  }

  let statsClone = { ...stats };

  const today = moment().tz(process.env.TIMEZONE);

  //check for day of week
  if (today.format("dddd") === "Sunday" && npc === "Nook") {
    return "You can't register Nook prices on Sundays.";
  } else if (today.format("dddd") !== "Sunday" && npc === "Daisy") {
    return "You can't register Daisy prices except on Sundays.";
  }

  const oldDate = moment(stats.today.date, "M/D/YYYY").tz(process.env.TIMEZONE);
  let message = `Price registered at ${price}.`;
  const user = msg.author.username;
  const value = price;
  const date = today.format("M/D/YYYY");
  const type =
    npc === "Daisy"
      ? "Daisy"
      : parseInt(today.format("H")) < 12
      ? "Nook (Morning)"
      : "Nook (Afternoon)";
  const priceData = { user, value, date, type };

  if (today.isAfter(oldDate.add(1, "d"))) {
    statsClone.today = {
      date,
      bestPrice: { user, value, type },
      allPrices: [{ user, value, type }]
    };

    message += ` First price of today registered.`;
  }

  statsClone.today.allPrices.push({ user, value, type });

  switch (npc) {
    case "Nook":
      if (price > stats.today.bestPrice.value) {
        message += ` New highest today!`;
        const data = { user, value, type };
        statsClone.today.bestPrice = data;
        statsClone.today.allPrices.push(data);
      }
      if (price < stats.lowestNookPriceEver.value) {
        statsClone.lowestNookPriceEver = priceData;
        message += ` New lowest Nook price ever!`;
      }
      if (price > stats.highestNookPriceEver.value) {
        statsClone.highestNookPriceEver = priceData;
        message += ` New highest Nook price ever!`;
      }
      break;
    case "Daisy":
      if (price < stats.today.bestPrice.value) {
        message += ` New lowest today!`;
        const data = { user, value, type };
        statsClone.today.bestPrice = data;
      }

      if (price < stats.lowestDaisyPriceEver.value) {
        statsClone.lowestDaisyPriceEver = priceData;
        message += ` New lowest Daisy price ever!`;
      }
      if (price > stats.highestDaisyPriceEver.value) {
        statsClone.highestDaisyPriceEver = priceData;
        message += ` New highest Daisy price ever!`;
      }
      break;
  }

  try {
    await fs.outputJSON("./data.json", statsClone);
    console.log("Wrote data to data.json");
  } catch (error) {
    console.log(error);
  }

  return message;
};
