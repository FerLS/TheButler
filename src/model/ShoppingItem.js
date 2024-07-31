import mongoose from "mongoose";

const ShoppingItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  houseID: { type: String, required: true },
});

export default mongoose.models.ShoppingItem ||
  mongoose.model("ShoppingItem", ShoppingItemSchema);
