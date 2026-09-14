const express = require("express");
const router = express.Router();
const Outfit = require("../models/Outfit");
const Clothes = require("../models/Clothes");
const jwt = require("jsonwebtoken");

// ------------------- GET MY OUTFITS -------------------


router.get("/my-outfits", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const outfits = await Outfit.find({ userId });

    const outfitsWithItems = await Promise.all(
      outfits.map(async (outfit) => {
        // Trim each ID in items array
        const validItemIds = outfit.items.map(id => id.trim());
        const items = await Clothes.find({ _id: { $in: validItemIds } });
        return { ...outfit._doc, items };
      })
    );

    res.status(200).json({ outfits: outfitsWithItems });
  } catch (err) {
    console.error("Fetch outfits error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// ------------------- DELETE OUTFIT -------------------
router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const outfit = await Outfit.findOne({ _id: req.params.id, userId });
    if (!outfit) return res.status(404).json({ message: "Outfit not found" });

    await Outfit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Outfit deleted" });
  } catch (err) {
    console.error("Delete outfit error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- UPDATE OUTFIT NAME -------------------
router.put("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const outfit = await Outfit.findOneAndUpdate(
      { _id: req.params.id, userId },
      { name },
      { new: true }
    );

    if (!outfit) return res.status(404).json({ message: "Outfit not found" });

    res.status(200).json(outfit);
  } catch (err) {
    console.error("Update outfit error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ------------------- CREATE OUTFIT -------------------
router.post("/create", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, items } = req.body;
    if (!name || !items || !items.length) {
      return res.status(400).json({ message: "Name and items are required" });
    }

    const outfit = new Outfit({
      name,
      items,
      userId,
    });

    await outfit.save();
    res.status(201).json(outfit);
  } catch (err) {
    console.error("Create outfit error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
