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
  name: "buying",
  description: "Registers a price for buying from Timmy Nook",
  execute
};
