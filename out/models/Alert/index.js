import mongoose from "mongoose";
var alertSchema = new mongoose.Schema({
    user: { type: String },
    nook: { type: Number },
    daisy: { type: Number },
});
var Alert = mongoose.model("Alert", alertSchema);
export default Alert;
