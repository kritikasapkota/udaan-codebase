const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  downloadTicket,
  cancelBooking
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getMyBookings);
router.get("/:pnr/pdf", authMiddleware, downloadTicket);
router.put("/:pnr/cancel", authMiddleware, cancelBooking);

module.exports = router;
