const execute = async ({ msg, args: [npc, value], Alert }) => {
  if (npc.toLowerCase() !== "nook" && npc.toLowerCase() !== "daisy") {
    return msg.channel.send(
      `${npc} is not a valid npc name. Use \`stalk! alert <daisy || nook>\``
    );
  }
  const updateData = { [npc.toLowerCase()]: value };
  const alert = await Alert.findOne({ user: msg.author.id }).exec();

  let hasAlert;
  if (alert) {
    await alert.update(updateData).exec();
    hasAlert = true;
  } else {
    const newAlert = new Alert({ user: msg.author.id, ...updateData });
    await newAlert.save();
  }

  const dmChannel = await msg.author.createDM();
  await dmChannel.send(
    `Price alert ${hasAlert ? "updated" : "registered"} for ${
      npc === "nook" ? "Nook" : "Daisy"
    } at ${value}`
  );
  msg.react("✅");
};

module.exports = {
  name: "alert",
  description:
    "Registers a threshold for buying or selling to have the bot send you a DM",
  execute
};
