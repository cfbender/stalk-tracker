import mongoose from "mongoose";
var priceSchema = new mongoose.Schema({
    user: { type: String },
    price: { type: Number },
    npc: { type: String },
    timing: { type: String },
    date: { type: Date },
});
var Price = mongoose.model("Price", priceSchema);
export default Price;
