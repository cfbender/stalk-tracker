const moment = require("moment-timezone");
const statsCommand = require("../commands/stats");
const todayCommand = require("../commands/today");

module.exports = async ({ msg, value, npc, updateChannel, Price }) => {
  value = parseInt(value);

  if (!value || isNaN(value)) {
    return msg.channel.send("You must give a price to register.");
  }

  const currentTime = moment().tz(process.env.TIMEZONE);

  //check for day of week
  if (currentTime.format("dddd") === "Sunday" && npc === "Nook") {
    return "You can't register Nook prices on Sundays.";
  } else if (currentTime.format("dddd") !== "Sunday" && npc === "Daisy") {
    return "You can't register Daisy prices except on Sundays.";
  }

  const allPrices = await Price.find({}).exec();

  const npcPrices = allPrices
    .filter(price => price.npc === npc)
    .map(({ price }) => price)
    .sort();
  const todaysBest = allPrices
    .filter(
      ({ date }) =>
        moment(date).format("MM/D/YYYY") === currentTime.format("MM/D/YYYY")
    )
    .map(({ price }) => price)
    .sort()[0];

  const records = {
    lowestEver: npcPrices[0],
    highestEver: npcPrices[npcPrices.length - 1]
  };

  let message = `Price registered at ${value}.`;
  let updateAllTime = false;
  let updateToday = false;
  const sendUpdates = process.env.SEND_UPDATES;
  const user = msg.author.username;

  const type =
    npc === "Daisy"
      ? "Daisy"
      : currentTime.hour() < 12
      ? "Morning"
      : "Afternoon";

  console.log(currentTime.format("MMMM Do YYYY, h:mm:ss a"));

  switch (npc) {
    case "Nook":
      if (value > todaysBest) {
        updateToday = true;
        message += ` New highest today!`;
      }
      break;

    case "Daisy":
      if (value < todaysBest) {
        updateToday = true;
        message += ` New lowest today!`;
      }
      break;
  }

  if (value < records.lowestEver) {
    updateAllTime = true;
    message += ` New lowest ${npc} price ever!`;
  }
  if (value > records.highestEver) {
    updateAllTime = true;
    message += ` New highest ${npc} price ever!`;
  }

  let newPrice = new Price({
    user,
    npc,
    price: value,
    timing: type,
    date: currentTime.toDate()
  });

  try {
    await newPrice.save();
  } catch (error) {
    console.log(error);
  }

  if (sendUpdates) {
    if (updateAllTime || updateToday) {
      updateChannel.send(message);
      if (updateAllTime) {
        statsCommand.execute({ msg: { channel: updateChannel } });
      }

      if (updateToday) {
        todayCommand.execute({ msg: { channel: updateChannel } });
      }
    }
  }

  return message;
};
