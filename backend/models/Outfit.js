const mongoose = require("mongoose");

const OutfitSchema = new mongoose.Schema({
  userId: String,
  name: String,
  items: [String], // Array of Clothes IDs
  occasion: String,
  season: String
});

module.exports = mongoose.model("Outfit", OutfitSchema);
