const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// 🔗 MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/appointmentDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 📦 Schema
const appointmentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  email: String,
  doctor: String,
  date: String,
  time: String,
  reason: String
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// 🏠 Main Page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 📄 Static Appointments Page
app.get("/view", (req, res) => {

  const html = `
  <html>
  <head>
    <title>Appointments</title>
    <style>
      body { font-family: Arial; background:#f2f2f2; }
      .box {
        width:400px;
        margin:40px auto;
        background:white;
        padding:20px;
        border-radius:10px;
      }
      .card {
        padding:10px;
        margin:10px 0;
        border:1px solid #ddd;
        border-radius:6px;
      }
      button {
        padding:10px;
        width:100%;
        background:#2196F3;
        color:white;
        border:none;
        border-radius:5px;
        cursor:pointer;
      }
    </style>
  </head>

  <body>
    <div class="box">
      <h2>Appointments</h2>

      <div class="card">
        <b>Manasvi</b><br>
        Email: manasvi@gmail.com<br>
        Doctor: Dr. Sharma<br>
        Date: 22-04-2026<br>
        Time: 02:23
      </div>

      <div class="card">
        <b>Rahul</b><br>
        Email: rahul@gmail.com<br>
        Doctor: Dr. Patel<br>
        Date: 23-04-2026<br>
        Time: 11:00
      </div>

      <div class="card">
        <b>Priya</b><br>
        Email: priya@gmail.com<br>
        Doctor: Dr. Sharma<br>
        Date: 24-04-2026<br>
        Time: 03:30
      </div>

      <div class="card">
        <b>Amit</b><br>
        Email: amit@gmail.com<br>
        Doctor: Dr. Patel<br>
        Date: 25-04-2026<br>
        Time: 09:45
      </div>

      <br>
      <button onclick="window.location='/'">⬅ Back</button>
    </div>
  </body>
  </html>
  `;

  res.send(html);
});

// ✅ Booking API (Clash Check still active)
app.post("/book", async (req, res) => {
  const { doctor, date, time } = req.body;

  const exists = await Appointment.findOne({ doctor, date, time });

  if (exists) {
    return res.json({
      success: false,
      message: "⚠ Slot already booked! Try another."
    });
  }

  const newApp = new Appointment(req.body);
  await newApp.save();

  res.json({
    success: true
  });
});

// 🚀 Start Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});