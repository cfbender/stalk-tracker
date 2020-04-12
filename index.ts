import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import Discord from "discord.js";
import { commands, Command } from "./commands";
import { models } from "./models";
const { Price, Alert } = models;
dotenv.config({ path: path.join(__dirname, "..", ".env") });
const TOKEN = process.env.TOKEN;
const bot = new Discord.Client();

try {
  bot.login(TOKEN);
} catch (error) {
  console.log(error);
}

let commandChannel: Discord.TextChannel;
let updateChannel: Discord.TextChannel;

const mongodb_uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(mongodb_uri, { useNewUrlParser: true });

bot.on("ready", async () => {
  console.info(`Logged in as ${bot.user?.tag}!`);
  if (!process.env.COMMAND_CHANNEL || !process.env.UPDATE_CHANNEL) {
    return console.error("Unique command and update channels not found");
  }
  commandChannel = (await bot.channels.fetch(
    process.env.COMMAND_CHANNEL
  )) as Discord.TextChannel;
  updateChannel = (await bot.channels.fetch(
    process.env.UPDATE_CHANNEL
  )) as Discord.TextChannel;
});

const botCommands = new Discord.Collection<string, Command>();

for (let command in commands) {
  botCommands.set(commands[command].name, commands[command]);
}

bot.on("message", (msg) => {
  let [trigger, command, ...args] = msg.content.split(/ +/);
  if(trigger === "stalk!") return msg.channel.send("Did you mean `!stalk`?");
  if (trigger !== "!stalk") return;

  if (msg.channel.id !== process.env.COMMAND_CHANNEL) {
    return msg.channel.send(
      `Commands only work in \`#${commandChannel.name}\``
    );
  }
  command = command.toLowerCase();
  console.info(`Called command: ${command}`);

  if (!botCommands.has(command)) return;

  try {
    botCommands
      .get(command)
      ?.execute({ msg, args, updateChannel, Price, Alert, bot });
  } catch (error) {
    console.error(error);
    msg.reply("There was an error trying to execute that command!");
  }
});
