import { helper } from "../utils/priceRegisterHelper";
import { ExecuteFn } from "../commands";

const execute: ExecuteFn = async ({
  msg,
  args: [value],
  updateChannel,
  bot,
  Price,
  Alert,
}) => {
  const message = await helper({
    msg,
    value,
    npc: "Nook",
    updateChannel,
    bot,
    Price,
    Alert,
  });
  msg.channel.send(message);
};

export default {
  name: "nook",
  description: "Registers a price that Nook is buying for",
  execute,
};
