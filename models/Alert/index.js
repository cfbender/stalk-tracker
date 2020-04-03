const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  user: { type: String },
  nook: { type: Number },
  daisy: { type: Number }
});

module.exports = mongoose.models.Alert || mongoose.model("Alert", alertSchema);
