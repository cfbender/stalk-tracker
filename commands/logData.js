const fs = require("fs-extra");
require("dotenv").config();

const admins = process.env.ADMINS.split(",");

const execute = async (msg, args) => {
  if (!admins.includes(msg.author.id)) {
    return msg.channel.send("You are not authorized to use that command.");
  }
  try {
    const stats = await fs.readJson("./data.json");
    console.log("data.json read in");
    console.log(stats);
  } catch (err) {
    console.error(err);
  }
  msg.channel.send("All data has been logged.");
};

module.exports = {
  name: "log_data",
  description: "Logs out all data",
  execute
};
