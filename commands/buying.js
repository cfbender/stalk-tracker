const helper = require("../utils/priceRegisterHelper");

const execute = async ({
  msg,
  args: [value],
  updateChannel,
  Prices,
  Price
}) => {
  const message = await helper({
    msg,
    value,
    npc: "Nook",
    updateChannel,
    Prices,
    Price
  });
  msg.channel.send(message);
};

module.exports = {
  name: "buying",
  description: "Registers a price for buying from Timmy Nook",
  execute
};
