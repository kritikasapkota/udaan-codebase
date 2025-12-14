const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    flightId: { type: String, required: true }, // AI-101
    airline: { type: String, required: true },

    source: { type: String, required: true },      // Chennai
    destination: { type: String, required: true }, // Delhi

    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    duration: { type: String, required: true },

    basePrice: { type: Number, required: true }, // NEVER changes
    currentPrice: { type: Number, required: true }, // changes with surge

    seatsAvailable: { type: Number, required: true },

    // Surge pricing tracking
    bookingAttempts: { type: Number, default: 0 },
    lastAttemptAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", flightSchema);
