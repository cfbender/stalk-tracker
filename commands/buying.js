const helper = require("../utils/priceRegisterHelper");

const execute = async (msg, [price], updateChannel) => {
  const message = await helper(msg, price, "Nook", updateChannel);
  msg.channel.send(message);
};

module.exports = {
  name: "buying",
  description: "Registers a price for buying from Timmy Nook",
  execute
};
