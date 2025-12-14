const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");
const BookingAttempt = require("../models/BookingAttempt");
const { v4: uuidv4 } = require("uuid");

// 🔥 DYNAMIC PRICING ENGINE
const calculateDynamicPrice = async (userId, flightId, basePrice) => {
  // Validate basePrice is a valid number
  if (typeof basePrice !== 'number' || isNaN(basePrice) || basePrice <= 0) {
    throw new Error('Invalid flight price');
  }

  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  const attempts = await BookingAttempt.countDocuments({
    user: userId,
    flight: flightId,
    attemptedAt: { $gte: fiveMinutesAgo }
  });

  let price = basePrice;
  let surgeApplied = false;

  if (attempts >= 3) {
    price = Math.round(basePrice * 1.1);
    surgeApplied = true;
  }

  return { price, surgeApplied };
};

// ✅ CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { flightId, passengers } = req.body;
    const userId = req.user.id;

    if (!flightId || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    // Record booking attempt
    await BookingAttempt.create({
      user: userId,
      flight: flightId
    });

    // Fetch flight
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (flight.seatsAvailable < passengers.length) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Validate flight price
    const flightPrice = flight.currentPrice || flight.basePrice;
    if (typeof flightPrice !== 'number' || isNaN(flightPrice) || flightPrice <= 0) {
      return res.status(400).json({ message: "Invalid flight price" });
    }

    // 🔥 Dynamic pricing
    const { price, surgeApplied } = await calculateDynamicPrice(
      userId,
      flightId,
      flightPrice
    );

    // Validate calculated price
    if (typeof price !== 'number' || isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Price calculation failed" });
    }

    const totalAmount = price * passengers.length;

    // Validate totalAmount
    if (typeof totalAmount !== 'number' || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.walletBalance < totalAmount) {
      return res.status(400).json({
        message: `Insufficient wallet balance`,
        balance: user.walletBalance
      });
    }

    // Deduct wallet - ensure walletBalance is a valid number
    const newBalance = user.walletBalance - totalAmount;
    if (typeof newBalance !== 'number' || isNaN(newBalance)) {
      return res.status(400).json({ message: "Wallet calculation error" });
    }
    
    user.walletBalance = newBalance;
    await user.save();

    // Log wallet transaction
    await WalletTransaction.create({
      user: userId,
      amount: totalAmount,
      type: "DEBIT",
      description: `Booking for flight ${flight.flightId}`
    });

    // Reduce seats
    flight.seatsAvailable -= passengers.length;
    await flight.save();

    // Sanitize passengers: ensure name and numeric age
    const sanitizedPassengers = passengers
      .filter(p => p && typeof p.name === 'string' && p.name.trim().length > 0)
      .map(p => ({
        name: p.name.trim(),
        age: typeof p.age === 'number' ? p.age : Number(p.age),
        gender: typeof p.gender === 'string' ? p.gender : 'Other'
      }));

    if (sanitizedPassengers.length === 0 || sanitizedPassengers.some(p => isNaN(p.age) || p.age <= 0)) {
      return res.status(400).json({ message: "Invalid passenger details" });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      flight: flightId,
      passengers: sanitizedPassengers,
      totalAmount,
      status: "Confirmed",
      pnr: uuidv4().split("-")[0].toUpperCase()
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
      surgeApplied,
      pricePerSeat: price
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET MY BOOKINGS
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("flight")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CANCEL BOOKING (20% deduction)
exports.cancelBooking = async (req, res) => {
  try {
    const { pnr } = req.params;
    const userId = req.user.id;

    // Find booking
    const booking = await Booking.findOne({ pnr }).populate("flight");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify user owns this booking
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if already cancelled
    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    // Calculate refund (80% of total amount, 20% deduction)
    const refundAmount = Math.round(booking.totalAmount * 0.8);
    const deductionAmount = booking.totalAmount - refundAmount;

    // Update user wallet
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.walletBalance += refundAmount;
    await user.save();

    // Log wallet transaction
    await WalletTransaction.create({
      user: userId,
      amount: refundAmount,
      type: "CREDIT",
      description: `Refund for cancelled booking ${pnr} (20% cancellation fee applied)`
    });

    // Restore seats to flight
    const flight = booking.flight;
    flight.seatsAvailable += booking.passengers.length;
    await flight.save();

    // Update booking status
    booking.status = "Cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      refundAmount,
      deductionAmount,
      newWalletBalance: user.walletBalance
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DOWNLOAD TICKET PDF
const generateTicketPDF = require("../utils/generateTicketPDF");

exports.downloadTicket = async (req, res) => {
  try {
    const { pnr } = req.params;
    const userId = req.user.id;

    // Find booking by PNR
    const booking = await Booking.findOne({ pnr })
      .populate("flight")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify user owns this booking
    if (booking.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Generate PDF and stream to response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="Ticket-${pnr}.pdf"`);

    generateTicketPDF(
      (chunk) => res.write(chunk),
      () => res.end(),
      booking
    );

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ message: "Error generating ticket" });
  }
};
