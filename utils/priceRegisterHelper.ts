import moment from "moment-timezone";
import cloneDeep from "lodash.clonedeep";
import statsCommand from "../commands/stats";
import todayCommand from "../commands/today";
import Discord from "discord.js";
import { Model } from "mongoose";
import { IAlert } from "../models/Alert";
import { IPrice } from "../models/Price";

const getPrices = async ({
  Price,
  npc,
  currentTime
}: {
  Price: Model<IPrice, {}>;
  npc: "Nook" | "Daisy";
  currentTime: moment.Moment;
}) => {
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
    lowestEver: npcPrices[0] || 0,
    highestEver: npcPrices.slice(-1).pop() || 0
  };
  return { todaysBest, records };
};

const generateMessage = ({
  value,
  todaysBest,
  records,
  npc
}: {
  value: number;
  todaysBest: number;
  records: { lowestEver: number; highestEver: number };
  npc: "Nook" | "Daisy";
}) => {
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

const getAlerts = async ({
  Alert,
  value
}: {
  Alert: Model<IAlert, {}>;
  value: number;
}) => {
  const alerts = await Alert.find({}).exec();
  return alerts
    ? alerts.filter(({ nook, daisy }) =>
        nook ? nook <= value : daisy ? daisy >= value : false
      )
    : [];
};

interface PriceHelperArgs {
  msg: Discord.Message;
  value: string;
  npc: "Nook" | "Daisy";
  updateChannel: Discord.TextChannel;
  Price: Model<IPrice, {}>;
  Alert: Model<IAlert, {}>;
  bot: Discord.Client;
}

type PriceHelper = ({
  msg,
  value,
  npc,
  updateChannel,
  Price,
  Alert,
  bot
}: PriceHelperArgs) => Promise<string>;

export const helper: PriceHelper = async ({
  msg,
  value,
  npc,
  updateChannel,
  Price,
  Alert,
  bot
}) => {
  const numValue = parseInt(value);

  if (!numValue || isNaN(numValue)) {
    return "You must give a price to register.";
  }

  if (numValue === 69) {
    await msg.channel.send("Nice.");
  }

  if (numValue === 420) {
    await msg.channel.send(
      "https://media.giphy.com/media/KpAPQVW9lWnWU/giphy.gif"
    );
  }

  const timezone = process.env.TIMEZONE || "America/Denver";
  const currentTime = moment().tz(timezone);

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
    value: numValue,
    todaysBest,
    records,
    npc
  });

  let newPrice = new Price({
    user,
    npc,
    price: numValue,
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
      await updateChannel.send(message);

      if (updateAllTime) {
        await statsCommand.execute({
          //@ts-ignore
          msg: { channel: updateChannel },
          Price,
          Alert,
          args: [""],
          updateChannel,
          bot
        });
      }
      if (updateToday) {
        await todayCommand.execute({
          //@ts-ignore
          msg: { channel: updateChannel },
          Price,
          Alert,
          args: [""],
          updateChannel,
          bot
        });
      }
    }
  }

  const firedAlerts = await getAlerts({ Alert, value: numValue });

  firedAlerts.forEach(async alert => {
    const user = await bot.users.fetch(alert.user);
    const dmChannel = await user.createDM();

    await dmChannel.send(
      `Your threshold of of ${
        alert.toObject()[npc.toLowerCase()]
      } for ${npc} has been hit! Current price is ${numValue}.`
    );
    const newMsg = cloneDeep(msg);
    newMsg.channel = updateChannel;
    await todayCommand.execute({
      msg: newMsg,
      Price,
      Alert,
      args: [""],
      updateChannel,
      bot
    });
  });

  return message;
};
