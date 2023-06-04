const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  user_role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  verificationToken: { type: String, default: null },
  is_verified: { type: Boolean, default: false },
  Enable_2FactAuth: { type: Boolean, default: false },
  twoFactSecret: { type: String, default: null },
  otpauth_url: { type: String, default: null },
  stack: { type: String, default: null },
});

const User = mongoose.model("users", userSchema);

module.exports = { User };
