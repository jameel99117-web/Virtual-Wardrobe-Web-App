const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
  preferences: String,
  image: String,
});

module.exports = mongoose.model("User", UserSchema);
