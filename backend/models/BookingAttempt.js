const mongoose = require("mongoose");

const bookingAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: "Flight", required: true },
  attemptedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BookingAttempt", bookingAttemptSchema);
