const moment = require("moment-timezone");
const statsCommand = require("../commands/stats");
const todayCommand = require("../commands/today");

const getPrices = async ({ Price, npc, currentTime }) => {
  const allPrices = await Price.find({}).exec();
  const npcPrices = allPrices
    .filter(price => price.npc === npc)
    .map(({ price }) => price)
    .sort((a, b) => a - b);
  const todaysBest = allPrices
    .filter(
      ({ date }) =>
        moment(date).format("MM/D/YYYY") === currentTime.format("MM/D/YYYY")
    )
    .map(({ price }) => price)
    .sort((a, b) => (currentTime.day() === 0 ? a - b : b - a))[0]; //sort ascending on Sunday, else descending

  const records = {
    lowestEver: npcPrices[0],
    highestEver: npcPrices.slice(-1).pop()
  };
  return { todaysBest, records };
};

const generateMessage = ({ value, todaysBest, records, npc }) => {
  let updateAllTime = false;
  let updateToday = false;

  let message = `Price registered at ${value}.`;
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

  return { message, updateAllTime, updateToday };
};

const getAlerts = async ({ Alert, npc, value }) => {
  const alerts = await Alert.find({}).exec();
  return alerts
    ? alerts.filter(({ [npc.toLowerCase()]: alertPrice }) =>
        npc === "Nook" ? alertPrice <= value : alertPrice >= value
      )
    : [];
};
module.exports = async ({
  msg,
  value,
  npc,
  updateChannel,
  Price,
  Alert,
  bot
}) => {
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

  const { todaysBest, records } = await getPrices({ Price, npc, currentTime });

  const sendUpdates = process.env.SEND_UPDATES;
  const user = msg.author.username;

  const type =
    npc === "Daisy"
      ? "Daisy"
      : currentTime.hour() < 12
      ? "Morning"
      : "Afternoon";

  const { message, updateAllTime, updateToday } = generateMessage({
    value,
    todaysBest,
    records,
    npc
  });

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
        statsCommand.execute({ msg: { channel: updateChannel }, Price });
      }

      if (updateToday) {
        todayCommand.execute({ msg: { channel: updateChannel }, Price });
      }
    }
  }

  const firedAlerts = await getAlerts({ Alert, npc, value });

  firedAlerts.forEach(async alert => {
    const user = await bot.users.fetch(alert.user);
    const dmChannel = await user.createDM();

    await dmChannel.send(
      `Your threshold of of ${
        alert[npc.toLowerCase()]
      } for ${npc} has been hit! Current price is ${value}.`
    );
    todayCommand.execute({ msg: { channel: dmChannel }, Price });
  });

  return message;
};
