import { MessageEmbed } from "discord.js";
import { ExecuteFn } from "../commands";

const execute: ExecuteFn = async ({ msg }) => {
  const embed = new MessageEmbed()
    .setTitle("Stalk Tracker Commands")
    .setColor(0x00ae86)
    .setThumbnail(
      "https://vignette3.wikia.nocookie.net/animalcrossing/images/b/b7/Turnip.png/revision/latest?cb=20100726212427"
    )
    .setTimestamp()
    .addField("**Stats**", "Shows all-time stats. Usage: `!stalk stats`")
    .addField(
      "**Daisy**",
      "Registers a price from Daisy Mae. Usage: `!stalk daisy <price>`"
    )
    .addField(
      "**Nook**",
      "Registers a price from Timmy Nook. Usage: `!stalk nook <price>`"
    )
    .addField(
      "**Today**",
      "Shows all stats and prices for the last day prices were added. Usage: `!stalk today`"
    )
    .addField(
      "**Alert**",
      "Will send you a DM when the price threshold is met. Usage: `!stalk alert <nook || daisy> <price>` to reset: `!stalk alert <nook || daisy> clear`"
    );

  await msg.channel.send(embed);
  return;
};

export default {
  name: "help",
  description: "Shows commands and usage",
  execute,
};
