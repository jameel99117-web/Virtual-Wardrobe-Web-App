const express = require("express");
const router = express.Router();

const Clothes = require("../models/Clothes");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vitual-wardrobe/clothes",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// Add new wardrobe item
router.post("/add", upload.single("imageFile"), async (req, res) => {
  try {
    const { name, type, color, season, occasion } = req.body;

    // Get userId from token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!name || !type || !color || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newClothes = new Clothes({
      name,
      type,
      color,
      season: season || "All",
      occasion: occasion || "Casual",
      imageURL: req.file.path,
      userId
    });

    await newClothes.save();
    res.status(201).json({ message: "Item added successfully", item: newClothes });
  } catch (err) {
    console.error("Clothes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all clothes for logged-in user
router.get("/my-items", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const items = await Clothes.find({ userId });
    res.status(200).json({ items });
  } catch (err) {
    console.error("Fetch clothes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a wardrobe item
router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const item = await Clothes.findOneAndDelete({ _id: req.params.id, userId });
    if (!item) {
      return res.status(404).json({ message: "Item not found or unauthorized" });
    }

    res.status(200).json({ message: "Item deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("Delete clothes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;