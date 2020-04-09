import { ExecuteFn } from "../commands";

const execute: ExecuteFn = async ({ msg, args: [npc, value], Alert }) => {
  npc = npc.toLowerCase();
  if (npc !== "nook" && npc !== "daisy") {
    return msg.channel.send(
      `${npc} is not a valid npc name. Use \`stalk! alert <daisy || nook>\``
    );
  }

  if (value === "clear") {
    const alert = await Alert.findOne({ user: msg.author.id }).exec();
    const newAlertData = alert?.toObject();
    delete newAlertData[npc];

    alert?.overwrite(newAlertData);
    await alert?.save();
    const dmChannel = await msg.author.createDM();
    await dmChannel.send(
      `Price alert cleared for ${npc === "nook" ? "Nook" : "Daisy"}`
    );
    return msg.react("✅");
  }

  const numValue = parseInt(value);

  if (!value || isNaN(numValue)) {
    return msg.channel.send("You must give a price to set.");
  }
  const updateData = { [npc]: numValue };
  const alert = await Alert.findOne({ user: msg.author.id }).exec();

  let hasAlert;
  if (alert) {
    await alert.updateOne(updateData).exec();
    hasAlert = alert.toObject().hasOwnProperty(npc);
  } else {
    const newAlert = new Alert({ user: msg.author.id, ...updateData });
    await newAlert.save();
  }

  const dmChannel = await msg.author.createDM();
  await dmChannel.send(
    `Price alert ${hasAlert ? "updated" : "registered"} for ${
      npc === "nook" ? "Nook" : "Daisy"
    } at ${numValue}`
  );
  msg.react("✅");
};

export default {
  name: "alert",
  description:
    "Registers a threshold for buying or selling to have the bot send you a DM",
  execute,
};
