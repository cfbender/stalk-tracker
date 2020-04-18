import { ExecuteFn } from ".";
import moment from "moment-timezone";
import Discord from "discord.js";

const execute: ExecuteFn = async ({ msg, args, Price, bot }) => {
  let user: string = msg.author.username;
  if (args[0]) {
    if (args[0].includes("@")) {
      const match = args[0].match(/[0-9]+/);
      if (match) {
        const discordUser = await bot.users.fetch(match[0]);
        user = discordUser.username;
      }
    }
  }

  const prices = await Price.find({ user });
  const timezone = process.env.TIMEZONE || "America/Denver";
  const lastSunday = moment()
    .tz(timezone)
    .day(0);
  const today = moment().tz(timezone);
  const daysSinceSunday = moment.duration(today.diff(lastSunday)).days();

  const thisWeek = prices
    .filter(price =>
      moment(price.date)
        .tz(timezone)
        .isSameOrAfter(lastSunday, "day")
    )
    .map(data => data.price);
  
  if(prices.length === 0 || thisWeek.length === 0) {
    return msg.channel.send(`No data found for user ${user}`);
  }
  
  const link = `https://ac-turnip.com/#${thisWeek.join("-")}`;

  if (thisWeek.length < daysSinceSunday * 2) {
    msg.channel.send(
      `**Warning**: It has been ${daysSinceSunday} since last Sunday and only ${thisWeek.length} prices are recorded. There may be incomplete data in the database this week for your username.`
    );
  }
  msg.channel.send(`Current price chart for ${user}: ${link}`);
};

export default {
  name: "calc",
  description:
    "Returns a link with this week's prices to  ac-turnip.com with your data!",
  execute
};
