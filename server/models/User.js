const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For normal signup
    googleId: { type: String }, // For Google OAuth users
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
