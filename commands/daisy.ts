import { ExecuteFn } from "../commands";
import { helper } from "../utils/priceRegisterHelper";

const execute: ExecuteFn = async ({
  msg,
  args: [value],
  updateChannel,
  Price,
  bot,
  Alert,
}) => {
  const message = await helper({
    msg,
    value,
    npc: "Daisy",
    updateChannel,
    Price,
    Alert,
    bot,
  });
  msg.channel.send(message);
};

export default {
  name: "daisy",
  description: "Registers a price that Daisy is selling for",
  execute,
};
