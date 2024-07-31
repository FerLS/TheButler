import mongoose from "mongoose";

const MealConfirmationSchema = new mongoose.Schema({
  houseID: { type: String, required: true },
  user: { type: String },
  date: { type: Date, required: true },
  confirmed: { type: Boolean, default: true },
});

export default mongoose.models.MealConfirmation ||
  mongoose.model("MealConfirmation", MealConfirmationSchema);
