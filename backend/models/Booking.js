const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  pnr: { type: String, required: true, unique: true },
  passengers: [{
    name: String,
    age: Number,
    gender: String
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);