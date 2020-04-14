import { ExecuteFn } from ".";
import moment from "moment-timezone";
const execute: ExecuteFn = async ({ msg, Price }) => {
  const prices = await Price.find({ user: msg.author.username });
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

  const link = `https://ac-turnip.com/#${thisWeek.join(",")}`;

  if (thisWeek.length < daysSinceSunday * 2) {
    msg.channel.send(
      `**Warning**: It has been ${daysSinceSunday} since last Sunday and only ${thisWeek.length} prices are recorded. There may be incomplete data in the database this week for your username.`
    );
  }
  msg.channel.send(`Current price chart for ${msg.author.username}: ${link}`);
};

export default {
  name: "calc",
  description:
    "Returns a link with this week's prices to  ac-turnip.com with your data!",
  execute
};
