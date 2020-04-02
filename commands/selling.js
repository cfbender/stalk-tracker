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
    npc: "Daisy",
    updateChannel,
    Prices,
    Price
  });
  msg.channel.send(message);
};

module.exports = {
  name: "selling",
  description: "Registers a price for selling",
  execute
};
