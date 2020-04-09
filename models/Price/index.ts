import mongoose from "mongoose";

export interface IPrice extends mongoose.Document {
  user: string;
  price: number;
  npc: "Nook" | "Daisy";
  timing: "Daisy" | "Morning" | "Afternoon";
  date: Date;
}

const priceSchema = new mongoose.Schema({
  user: { type: String },
  price: { type: Number },
  npc: { type: String },
  timing: { type: String },
  date: { type: Date },
});

const Price = mongoose.model<IPrice>("Price", priceSchema);
export default Price;
