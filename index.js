require("dotenv").config();
const Discord = require("discord.js");
const botCommands = require("./commands");
const TOKEN = process.env.TOKEN;

const bot = new Discord.Client();
bot.login(TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});
bot.commands = new Discord.Collection();

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

bot.on("message", msg => {
  let [trigger, command, ...args] = msg.content.split(/ +/);
  if (trigger !== "stalk!") return;
  command = command.toLowerCase();
  console.info(`Called command: ${command}`);

  if (!bot.commands.has(command)) return;

  try {
    bot.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("There was an error trying to execute that command!");
  }
});
