const Flight = require("../models/Flight");

// SEARCH FLIGHTS
exports.searchFlights = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    let query = {
      seatsAvailable: { $gt: 0 } // IMPORTANT
    };

    if (source) {
      query.source = { $regex: new RegExp(`^${source}$`, "i") };
    }

    if (destination) {
      query.destination = { $regex: new RegExp(`^${destination}$`, "i") };
    }

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.departureTime = {
        $gte: searchDate,
        $lt: nextDay
      };
    }

    const flights = await Flight.find(query)
      .sort({ currentPrice: 1 }) // cheapest first
      .limit(10); // PDF REQUIREMENT

    res.json(flights);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// GET ALL FLIGHTS (ADMIN / DEBUG)
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find({});
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET FLIGHT BY ID
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(400).json({ message: 'Invalid flight ID' });
  }
};

