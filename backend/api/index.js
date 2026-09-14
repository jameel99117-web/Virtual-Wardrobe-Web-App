const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());

// ------------------- DATABASE CONNECTION -------------------
// Cached connection so Vercel doesn't reconnect on every request
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ------------------- ROUTES -------------------

app.use("/api/auth", require("../routes/user"));
app.use("/api/clothes", require("../routes/clothes"));
app.use("/api/outfits", require("../routes/outfits"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// DO NOT use app.listen() — Vercel handles that
module.exports = app;