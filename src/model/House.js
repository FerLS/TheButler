import mongoose from "mongoose";

const HouseSchema = new mongoose.Schema({
  houseID: { type: String, required: true },
});

export default mongoose.models.House || mongoose.model("House", HouseSchema);
