const express = require("express");
const router = express.Router();
const Booking = require("./Booking");

router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Data saved successfully to MongoDB Atlas" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
