import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  houseID: {
    type: String,
  },
  defaultMeal: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
