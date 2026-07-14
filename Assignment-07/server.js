const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Updated Connection - Using a fresh DB name 'collegeFeedback'
mongoose.connect("mongodb+srv://admin:12345@admin.wcpc0dk.mongodb.net/collegeFeedback")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("DB Error:", err));

// Expanded Schema
const FeedbackSchema = new mongoose.Schema({
  name: String,
  subject: String,
  facultyName: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

// GET All
app.get("/feedback", async (req, res) => {
  try {
    const data = await Feedback.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// POST New
app.post("/feedback", async (req, res) => {
  try {
    const newData = new Feedback(req.body);
    await newData.save();
    res.json(newData);
  } catch (err) {
    res.status(500).json({ error: "Error saving feedback" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000 🚀"));