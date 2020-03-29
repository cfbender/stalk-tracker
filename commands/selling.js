const helper = require("../utils/priceRegisterHelper");

const execute = async (msg, [price]) => {
  const message = await helper(msg, price, "Daisy");
  msg.channel.send(message);
};

module.exports = {
  name: "selling",
  description: "Registers a price for selling",
  execute
};
