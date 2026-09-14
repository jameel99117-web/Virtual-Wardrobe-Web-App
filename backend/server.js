const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(" MongoDB connected successfully!"))
  .catch(err => {
    console.error(" MongoDB connection error:", err.message);
    if (err.name === "MongooseServerSelectionError") {
      console.error(" Note: Check if your IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> 0.0.0.0/0).");
    }
  });





const userRoutes = require("./routes/user");       // signup/login
const clothesRoutes = require("./routes/clothes"); // clothes CRUD
const outfitRoutes = require("./routes/outfits");  // outfit CRUD


app.use("/api/auth", userRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/outfits", outfitRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
