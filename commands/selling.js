const fs = require("fs-extra");
const moment = require("moment");

const execute = async (msg, [price]) => {
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

  const today = moment();
  if (today.format("dddd") !== "Sunday") {
    return msg.channel.send(
      "You can't register Daisy prices except on Sundays."
    );
  }
  const oldDate = moment(stats.today.date, "M/D/YYYY");
  let message = `Price registered at ${price}.`;
  const user = msg.author.username;
  const value = price;
  const date = today.format("M/D/YYYY");
  const priceData = { user, value, date };

  if (today.isAfter(oldDate.add(1, "d"))) {
    statsClone.today = {
      date,
      bestPrice: { user, value },
      allPrices: [{ user, value }]
    };

    message += ` First price of today registered.`;
  }

  if (price < stats.today.bestPrice.value) {
    message += ` New lowest today!`;
    const data = { user, value };
    statsClone.today.bestPrice = data;
    statsClone.today.allPrices.push(data);
  }

  if (price < stats.lowestDaisyPriceEver.value) {
    statsClone.lowestDaisyPriceEver = priceData;
    message += ` New lowest Daisy price ever!`;
  }
  if (price > stats.highestDaisyPriceEver.value) {
    statsClone.highestDaisyPriceEver = priceData;
    message += ` New highest Daisy price ever!`;
  }
  msg.channel.send(message);

  try {
    await fs.outputJSON("./data.json", statsClone);
    console.log("Wrote data to data.json");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  name: "selling",
  description: "Registers a price for selling",
  execute
};
