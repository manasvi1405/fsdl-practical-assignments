const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serves your frontend files

// Connect to your MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Database Schema - Updated to match your new form requirements
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  packageName: String,
  persons: Number,
  insurance: String,
  totalCost: Number,
  bookingDate: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);

// API Route to save data
app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Data saved successfully to MongoDB Atlas!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));