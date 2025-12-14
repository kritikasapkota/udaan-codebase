const express = require('express');
const router = express.Router();
const {
  searchFlights,
  getAllFlights,
  getFlightById
} = require('../controllers/flightController');

router.get('/', searchFlights);
router.get('/all', getAllFlights);
router.get('/:id', getFlightById); // ✅ ADD THIS

module.exports = router;
