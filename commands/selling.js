const helper = require("../utils/priceRegisterHelper");

const execute = async ({
  msg,
  args: [value],
  updateChannel,
  Price,
  bot,
  Alert
}) => {
  const message = await helper({
    msg,
    value,
    npc: "Daisy",
    updateChannel,
    Price,
    Alert,
    bot
  });
  msg.channel.send(message);
};

module.exports = {
  name: "selling",
  description: "Registers a price for selling",
  execute
};
