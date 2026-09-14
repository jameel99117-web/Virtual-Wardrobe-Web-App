const mongoose = require("mongoose");

const ClothesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true }, // Top, Bottom, Shoes, etc.
  color: { type: String, required: true },
  season: { type: String },
  occasion: { type: String },
  imageURL: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Clothes", ClothesSchema);