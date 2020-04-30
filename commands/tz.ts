import { ExecuteFn } from "../commands";
import { helper } from "../utils/priceRegisterHelper";

const execute: ExecuteFn = async ({
  msg,
  args: [value],
  updateChannel,
  Price,
  bot,
  Alert
}) => {
  const timezones = ["eastern", "central", "mountain", "pacific"];

  if (!timezones.includes(value)) {
    return msg.channel.send(
      "You must include a timezone value of eastern || central || mountain || pacific"
    );
  }

  const timezoneRoles = msg.guild?.roles.cache.filter(role =>
    Boolean(role.name.match(/Time/g))
  );
  const userRoles = msg.member?.roles;

  let role;
  switch (value) {
    case "eastern":
      role = timezoneRoles?.filter(role => role.name === "Eastern Time");
      break;
    case "central":
      role = timezoneRoles?.filter(role => role.name === "Central Time");
      break;
    case "mountain":
      role = timezoneRoles?.filter(role => role.name === "Mountain Time");
      break;
    case "pacific":
      role = timezoneRoles?.filter(role => role.name === "Pacific Time");
      break;
  }
  if (role) {
    userRoles?.add(role);
  }
};

export default {
  name: "tz",
  description: "Adds a Timezone role for a",
  execute
};
