require("dotenv").config();
const mongoose = require("mongoose");
const Discord = require("discord.js");
const botCommands = require("./commands");
const TOKEN = process.env.TOKEN;
const { Price } = require("./models");
const bot = new Discord.Client();
bot.login(TOKEN);

let commandChannel;
let updateChannel;

mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

bot.on("ready", async () => {
  console.info(`Logged in as ${bot.user.tag}!`);
  commandChannel = await bot.channels.fetch(process.env.COMMAND_CHANNEL);
  updateChannel = await bot.channels.fetch(process.env.UPDATE_CHANNEL);
});

bot.commands = new Discord.Collection();

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.on("message", msg => {
  let [trigger, command, ...args] = msg.content.split(/ +/);
  if (trigger !== "stalk!") return;

  if (msg.channel.id !== process.env.COMMAND_CHANNEL) {
    return msg.channel.send(
      `Commands only work in \`#${commandChannel.name}\``
    );
  }
  command = command.toLowerCase();
  console.info(`Called command: ${command}`);

  if (!bot.commands.has(command)) return;

  try {
    bot.commands.get(command).execute({ msg, args, updateChannel, Price });
  } catch (error) {
    console.error(error);
    msg.reply("There was an error trying to execute that command!");
  }
});
