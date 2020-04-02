const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  user: { type: String },
  price: { type: String },
  npc: { type: String },
  timing: { type: String },
  date: { type: Date }
});

module.exports = mongoose.models.Price || mongoose.model("Price", priceSchema);
