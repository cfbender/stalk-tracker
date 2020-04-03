const execute = async ({ msg, args: [npc, value], Alert }) => {
  if (npc.toLowerCase() !== "nook" && npc.toLowerCase() !== "daisy") {
    return msg.channel.send(
      `${npc} is not a valid npc name. Use \`stalk! alert <daisy || nook>\``
    );
  }
  let hasAlert;
  const updateData = { [npc.toLowerCase()]: value };
  const alert = await Alert.findOne({ user: msg.author.id }).exec();
  console.log(alert);
  if (alert) {
    hasAlert = true;
  }

  await alert
    .update(updateData, {
      upsert: true
    })
    .exec();
  console.log(npc, value);
  const dmChannel = await msg.author.createDM();
  await dmChannel.send(
    `Price alert ${hasAlert ? "updated" : "registered"} for ${
      npc === "nook" ? "Nook" : "Daisy"
    } at ${value}`
  );
};

module.exports = {
  name: "alert",
  description:
    "Registers a threshold for buying or selling to have the bot send you a DM",
  execute
};
