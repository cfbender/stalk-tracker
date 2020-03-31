const helper = require("../utils/priceRegisterHelper");

const execute = async (msg, [price], updateChannel) => {
  const message = await helper(msg, price, "Daisy", updateChannel);
  msg.channel.send(message);
};

module.exports = {
  name: "selling",
  description: "Registers a price for selling",
  execute
};
