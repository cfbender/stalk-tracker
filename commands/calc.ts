import { ExecuteFn } from ".";
import moment from "moment-timezone";
const execute: ExecuteFn = async ({ msg, Price }) => {
  const prices = await Price.find({ user: msg.author.username });
  const timezone = process.env.TIMEZONE || "America/Denver";
  const lastSunday = moment().day(0);
  const daysSinceSunday =
    lastSunday.fromNow(true)[0] === "a"
      ? 1
      : parseInt(lastSunday.fromNow(true)[0]);

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
  msg.channel.send(link);
};

export default {
  name: "calc",
  description:
    "Returns a link with this week's prices to  ac-turnip.com with your data!",
  execute
};
