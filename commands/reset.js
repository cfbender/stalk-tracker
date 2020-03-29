const fs = require("fs-extra");
require("dotenv").config();
const moment = require("moment");

const admins = process.env.ADMINS.split(",");

const execute = async (msg, args) => {
  if (!admins.includes(msg.author.id)) {
    return msg.channel.send("You are not authorized to use that command.");
  }
  const user = msg.author.username;
  const newDate = moment()
    .subtract(1, "d")
    .format("M/D/YYYY");

  let resetData = {
    highestNookPriceEver: {
      user: user,
      value: 0,
      date: newDate
    },
    lowestNookPriceEver: {
      value: 99999999,
      date: "3/25/2020",
      user: user
    },
    highestDaisyPriceEver: {
      user: user,
      value: 0,
      date: newDate
    },
    lowestDaisyPriceEver: {
      user: user,
      value: 99999999,
      date: newDate
    },
    today: {
      date: newDate,
      bestPrice: { user: user, value: 0, type: "Reset" },
      allPrices: []
    }
  };

  try {
    await fs.outputJSON("./data.json", resetData);
    console.log("Wrote reset data to data.json");
  } catch (error) {
    console.log(error);
  }
  msg.channel.send("All data has been reset!");
};

module.exports = {
  name: "reset",
  description: "Resets all data",
  execute
};
