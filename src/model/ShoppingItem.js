import mongoose from "mongoose";

const ShoppingItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  houseID: { type: String, required: true },
  checked: { type: Boolean, default: false },
});

export default mongoose.models.ShoppingItem ||
  mongoose.model("ShoppingItem", ShoppingItemSchema);
