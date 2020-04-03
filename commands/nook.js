const helper = require("../utils/priceRegisterHelper");

const execute = async ({
  msg,
  args: [value],
  updateChannel,
  bot,
  Price,
  Alert
}) => {
  const message = await helper({
    msg,
    value,
    npc: "Nook",
    updateChannel,
    bot,
    Price,
    Alert
  });
  msg.channel.send(message);
};

module.exports = {
  name: "nook",
  description: "Registers a price that Nook is buying for",
  execute
};
