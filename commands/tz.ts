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
      `You must include a timezone value from one of \`${timezones.join(" || ")}\``
    );
  }

  const timezoneRoles = msg.guild?.roles.cache.filter(role =>
    Boolean(role.name.match(/Time/g))
  );
  const userRoles = msg.member?.roles;

  let roleName = "";

  switch (value) {
    case "eastern":
      roleName = "Eastern Time";
      break;
    case "central":
      roleName = "Central Time";
      break;
    case "mountain":
      roleName = "Mountain Time";
      break;
    case "pacific":
      roleName = "Pacific Time";
      break;
  }

  const role = timezoneRoles?.filter(role => role.name === roleName);
  if (role && roleName) {
    userRoles?.add(role);
    return msg.channel.send(`Role added as \`${roleName}\``);
  }
};

export default {
  name: "tz",
  description: "Adds a Timezone role for a",
  execute
};
