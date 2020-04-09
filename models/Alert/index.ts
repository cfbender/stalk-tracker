import mongoose from "mongoose";

export interface IAlert extends mongoose.Document {
  user: string;
  nook?: number;
  daisy?: number;
}
const alertSchema = new mongoose.Schema({
  user: { type: String },
  nook: { type: Number },
  daisy: { type: Number },
});

const Alert = mongoose.model<IAlert>("Alert", alertSchema);
export default Alert;
