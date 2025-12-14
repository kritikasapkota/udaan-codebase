const mongoose = require("mongoose");
const Flight = require("./models/Flight");
const User = require("./models/User");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/airplane_mgmt", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log("✅ Connected to DB for Seeding");

    // Clear existing data
    await Flight.deleteMany({});
    await User.deleteMany({});

    // Create sample users
    const hashedPassword = await bcryptjs.hash("password123", 10);
    const users = await User.insertMany([
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        walletBalance: 100000,
        role: "user"
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        walletBalance: 150000,
        role: "user"
      }
    ]);
    console.log("✅ Users Seeded");

    // Comprehensive flight data - 25 flights across major Indian routes
    const flights = [
      // Delhi - Mumbai (Budget)
      {
        flightId: "6E-202",
        airline: "IndiGo",
        source: "Delhi",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T08:00:00"),
        arrivalTime: new Date("2025-01-15T10:30:00"),
        duration: "2h 30m",
        basePrice: 4500,
        currentPrice: 4500,
        seatsAvailable: 120
      },
      {
        flightId: "SG-101",
        airline: "SpiceJet",
        source: "Delhi",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T10:00:00"),
        arrivalTime: new Date("2025-01-15T12:30:00"),
        duration: "2h 30m",
        basePrice: 4200,
        currentPrice: 4200,
        seatsAvailable: 100
      },
      {
        flightId: "6E-203",
        airline: "IndiGo",
        source: "Delhi",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T14:00:00"),
        arrivalTime: new Date("2025-01-15T16:30:00"),
        duration: "2h 30m",
        basePrice: 5000,
        currentPrice: 5500,
        seatsAvailable: 80
      },

      // Delhi - Bangalore
      {
        flightId: "AI-501",
        airline: "Air India",
        source: "Delhi",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T07:30:00"),
        arrivalTime: new Date("2025-01-15T10:00:00"),
        duration: "2h 30m",
        basePrice: 5500,
        currentPrice: 5500,
        seatsAvailable: 110
      },
      {
        flightId: "6E-204",
        airline: "IndiGo",
        source: "Delhi",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T12:00:00"),
        arrivalTime: new Date("2025-01-15T14:30:00"),
        duration: "2h 30m",
        basePrice: 5200,
        currentPrice: 5200,
        seatsAvailable: 95
      },
      {
        flightId: "SG-102",
        airline: "SpiceJet",
        source: "Delhi",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T15:00:00"),
        arrivalTime: new Date("2025-01-15T17:30:00"),
        duration: "2h 30m",
        basePrice: 4800,
        currentPrice: 4800,
        seatsAvailable: 85
      },

      // Mumbai - Bangalore
      {
        flightId: "AI-502",
        airline: "Air India",
        source: "Mumbai",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T06:00:00"),
        arrivalTime: new Date("2025-01-15T08:00:00"),
        duration: "2h 00m",
        basePrice: 4000,
        currentPrice: 4000,
        seatsAvailable: 90
      },
      {
        flightId: "UK-301",
        airline: "Vistara",
        source: "Mumbai",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T09:00:00"),
        arrivalTime: new Date("2025-01-15T11:00:00"),
        duration: "2h 00m",
        basePrice: 5000,
        currentPrice: 5000,
        seatsAvailable: 75
      },
      {
        flightId: "6E-205",
        airline: "IndiGo",
        source: "Mumbai",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T12:30:00"),
        arrivalTime: new Date("2025-01-15T14:30:00"),
        duration: "2h 00m",
        basePrice: 4500,
        currentPrice: 4500,
        seatsAvailable: 100
      },

      // Delhi - Kolkata
      {
        flightId: "6E-206",
        airline: "IndiGo",
        source: "Delhi",
        destination: "Kolkata",
        departureTime: new Date("2025-01-15T08:30:00"),
        arrivalTime: new Date("2025-01-15T10:45:00"),
        duration: "2h 15m",
        basePrice: 4000,
        currentPrice: 4000,
        seatsAvailable: 88
      },
      {
        flightId: "AI-503",
        airline: "Air India",
        source: "Delhi",
        destination: "Kolkata",
        departureTime: new Date("2025-01-15T13:00:00"),
        arrivalTime: new Date("2025-01-15T15:15:00"),
        duration: "2h 15m",
        basePrice: 4500,
        currentPrice: 5000,
        seatsAvailable: 70
      },

      // Mumbai - Hyderabad
      {
        flightId: "UK-302",
        airline: "Vistara",
        source: "Mumbai",
        destination: "Hyderabad",
        departureTime: new Date("2025-01-15T07:00:00"),
        arrivalTime: new Date("2025-01-15T08:45:00"),
        duration: "1h 45m",
        basePrice: 3500,
        currentPrice: 3500,
        seatsAvailable: 65
      },
      {
        flightId: "6E-207",
        airline: "IndiGo",
        source: "Mumbai",
        destination: "Hyderabad",
        departureTime: new Date("2025-01-15T10:15:00"),
        arrivalTime: new Date("2025-01-15T12:00:00"),
        duration: "1h 45m",
        basePrice: 3200,
        currentPrice: 3200,
        seatsAvailable: 115
      },

      // Bangalore - Hyderabad
      {
        flightId: "SG-103",
        airline: "SpiceJet",
        source: "Bangalore",
        destination: "Hyderabad",
        departureTime: new Date("2025-01-15T08:00:00"),
        arrivalTime: new Date("2025-01-15T09:15:00"),
        duration: "1h 15m",
        basePrice: 2500,
        currentPrice: 2500,
        seatsAvailable: 92
      },
      {
        flightId: "6E-208",
        airline: "IndiGo",
        source: "Bangalore",
        destination: "Hyderabad",
        departureTime: new Date("2025-01-15T11:00:00"),
        arrivalTime: new Date("2025-01-15T12:15:00"),
        duration: "1h 15m",
        basePrice: 2800,
        currentPrice: 2800,
        seatsAvailable: 87
      },

      // Kolkata - Bangalore
      {
        flightId: "AI-504",
        airline: "Air India",
        source: "Kolkata",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T06:30:00"),
        arrivalTime: new Date("2025-01-15T09:00:00"),
        duration: "2h 30m",
        basePrice: 5500,
        currentPrice: 5500,
        seatsAvailable: 78
      },
      {
        flightId: "6E-209",
        airline: "IndiGo",
        source: "Kolkata",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T14:00:00"),
        arrivalTime: new Date("2025-01-15T16:30:00"),
        duration: "2h 30m",
        basePrice: 5000,
        currentPrice: 5000,
        seatsAvailable: 105
      },

      // Chennai - Delhi
      {
        flightId: "UK-303",
        airline: "Vistara",
        source: "Chennai",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T05:30:00"),
        arrivalTime: new Date("2025-01-15T08:30:00"),
        duration: "3h 00m",
        basePrice: 6500,
        currentPrice: 6500,
        seatsAvailable: 82
      },
      {
        flightId: "AI-505",
        airline: "Air India",
        source: "Chennai",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T10:00:00"),
        arrivalTime: new Date("2025-01-15T13:00:00"),
        duration: "3h 00m",
        basePrice: 6800,
        currentPrice: 7200,
        seatsAvailable: 65
      },

      // Pune - Mumbai
      {
        flightId: "6E-210",
        airline: "IndiGo",
        source: "Pune",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T07:30:00"),
        arrivalTime: new Date("2025-01-15T08:30:00"),
        duration: "1h 00m",
        basePrice: 2000,
        currentPrice: 2000,
        seatsAvailable: 140
      },
      {
        flightId: "SG-104",
        airline: "SpiceJet",
        source: "Pune",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T12:00:00"),
        arrivalTime: new Date("2025-01-15T13:00:00"),
        duration: "1h 00m",
        basePrice: 1800,
        currentPrice: 1800,
        seatsAvailable: 125
      },

      // Goa - Mumbai
      {
        flightId: "UK-304",
        airline: "Vistara",
        source: "Goa",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T08:00:00"),
        arrivalTime: new Date("2025-01-15T09:30:00"),
        duration: "1h 30m",
        basePrice: 2800,
        currentPrice: 2800,
        seatsAvailable: 98
      },
      {
        flightId: "AI-506",
        airline: "Air India",
        source: "Goa",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T13:30:00"),
        arrivalTime: new Date("2025-01-15T15:00:00"),
        duration: "1h 30m",
        basePrice: 3200,
        currentPrice: 3200,
        seatsAvailable: 75
      },

      // Jaipur - Delhi
      {
        flightId: "6E-401",
        airline: "IndiGo",
        source: "Jaipur",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T06:30:00"),
        arrivalTime: new Date("2025-01-15T07:30:00"),
        duration: "1h 00m",
        basePrice: 2200,
        currentPrice: 2200,
        seatsAvailable: 110
      },
      {
        flightId: "SG-402",
        airline: "SpiceJet",
        source: "Jaipur",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T09:00:00"),
        arrivalTime: new Date("2025-01-15T10:45:00"),
        duration: "1h 45m",
        basePrice: 3400,
        currentPrice: 3400,
        seatsAvailable: 95
      },

      // Ahmedabad Routes
      {
        flightId: "AI-601",
        airline: "Air India",
        source: "Ahmedabad",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T07:00:00"),
        arrivalTime: new Date("2025-01-15T08:45:00"),
        duration: "1h 45m",
        basePrice: 3600,
        currentPrice: 3600,
        seatsAvailable: 88
      },
      {
        flightId: "6E-602",
        airline: "IndiGo",
        source: "Ahmedabad",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T11:30:00"),
        arrivalTime: new Date("2025-01-15T12:45:00"),
        duration: "1h 15m",
        basePrice: 2800,
        currentPrice: 2800,
        seatsAvailable: 102
      },
      {
        flightId: "UK-603",
        airline: "Vistara",
        source: "Ahmedabad",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T14:00:00"),
        arrivalTime: new Date("2025-01-15T16:30:00"),
        duration: "2h 30m",
        basePrice: 4200,
        currentPrice: 4200,
        seatsAvailable: 76
      },

      // Kochi Routes
      {
        flightId: "6E-701",
        airline: "IndiGo",
        source: "Kochi",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T06:00:00"),
        arrivalTime: new Date("2025-01-15T07:15:00"),
        duration: "1h 15m",
        basePrice: 2600,
        currentPrice: 2600,
        seatsAvailable: 118
      },
      {
        flightId: "AI-702",
        airline: "Air India",
        source: "Kochi",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T10:30:00"),
        arrivalTime: new Date("2025-01-15T12:45:00"),
        duration: "2h 15m",
        basePrice: 4000,
        currentPrice: 4000,
        seatsAvailable: 82
      },
      {
        flightId: "SG-703",
        airline: "SpiceJet",
        source: "Kochi",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T15:00:00"),
        arrivalTime: new Date("2025-01-15T18:00:00"),
        duration: "3h 00m",
        basePrice: 5400,
        currentPrice: 5400,
        seatsAvailable: 94
      },

      // Coimbatore Routes
      {
        flightId: "6E-801",
        airline: "IndiGo",
        source: "Coimbatore",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T07:15:00"),
        arrivalTime: new Date("2025-01-15T08:15:00"),
        duration: "1h 00m",
        basePrice: 2400,
        currentPrice: 2400,
        seatsAvailable: 106
      },
      {
        flightId: "AI-802",
        airline: "Air India",
        source: "Coimbatore",
        destination: "Chennai",
        departureTime: new Date("2025-01-15T12:00:00"),
        arrivalTime: new Date("2025-01-15T13:00:00"),
        duration: "1h 00m",
        basePrice: 2200,
        currentPrice: 2200,
        seatsAvailable: 90
      },

      // Lucknow Routes
      {
        flightId: "SG-901",
        airline: "SpiceJet",
        source: "Lucknow",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T08:30:00"),
        arrivalTime: new Date("2025-01-15T09:45:00"),
        duration: "1h 15m",
        basePrice: 2800,
        currentPrice: 2800,
        seatsAvailable: 97
      },
      {
        flightId: "6E-902",
        airline: "IndiGo",
        source: "Lucknow",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T13:15:00"),
        arrivalTime: new Date("2025-01-15T15:30:00"),
        duration: "2h 15m",
        basePrice: 4200,
        currentPrice: 4200,
        seatsAvailable: 85
      },

      // Patna Routes
      {
        flightId: "6E-1001",
        airline: "IndiGo",
        source: "Patna",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T09:00:00"),
        arrivalTime: new Date("2025-01-15T11:00:00"),
        duration: "2h 00m",
        basePrice: 3500,
        currentPrice: 3500,
        seatsAvailable: 103
      },
      {
        flightId: "AI-1002",
        airline: "Air India",
        source: "Patna",
        destination: "Kolkata",
        departureTime: new Date("2025-01-15T14:30:00"),
        arrivalTime: new Date("2025-01-15T15:45:00"),
        duration: "1h 15m",
        basePrice: 2900,
        currentPrice: 2900,
        seatsAvailable: 78
      },

      // Chandigarh Routes
      {
        flightId: "UK-1101",
        airline: "Vistara",
        source: "Chandigarh",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T07:30:00"),
        arrivalTime: new Date("2025-01-15T08:30:00"),
        duration: "1h 00m",
        basePrice: 2300,
        currentPrice: 2300,
        seatsAvailable: 92
      },
      {
        flightId: "6E-1102",
        airline: "IndiGo",
        source: "Chandigarh",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T11:00:00"),
        arrivalTime: new Date("2025-01-15T13:15:00"),
        duration: "2h 15m",
        basePrice: 4100,
        currentPrice: 4100,
        seatsAvailable: 87
      },

      // Indore Routes
      {
        flightId: "6E-1201",
        airline: "IndiGo",
        source: "Indore",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T06:45:00"),
        arrivalTime: new Date("2025-01-15T08:30:00"),
        duration: "1h 45m",
        basePrice: 3400,
        currentPrice: 3400,
        seatsAvailable: 99
      },
      {
        flightId: "SG-1202",
        airline: "SpiceJet",
        source: "Indore",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T12:30:00"),
        arrivalTime: new Date("2025-01-15T13:45:00"),
        duration: "1h 15m",
        basePrice: 2700,
        currentPrice: 2700,
        seatsAvailable: 108
      },

      // Bhopal Routes
      {
        flightId: "AI-1301",
        airline: "Air India",
        source: "Bhopal",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T10:00:00"),
        arrivalTime: new Date("2025-01-15T11:30:00"),
        duration: "1h 30m",
        basePrice: 3200,
        currentPrice: 3200,
        seatsAvailable: 84
      },
      {
        flightId: "6E-1302",
        airline: "IndiGo",
        source: "Bhopal",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T15:00:00"),
        arrivalTime: new Date("2025-01-15T16:30:00"),
        duration: "1h 30m",
        basePrice: 3000,
        currentPrice: 3000,
        seatsAvailable: 91
      },

      // Nagpur Routes
      {
        flightId: "6E-1401",
        airline: "IndiGo",
        source: "Nagpur",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T08:00:00"),
        arrivalTime: new Date("2025-01-15T10:00:00"),
        duration: "2h 00m",
        basePrice: 3800,
        currentPrice: 3800,
        seatsAvailable: 95
      },
      {
        flightId: "SG-1402",
        airline: "SpiceJet",
        source: "Nagpur",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T13:45:00"),
        arrivalTime: new Date("2025-01-15T15:15:00"),
        duration: "1h 30m",
        basePrice: 3100,
        currentPrice: 3100,
        seatsAvailable: 100
      },

      // Varanasi Routes
      {
        flightId: "AI-1501",
        airline: "Air India",
        source: "Varanasi",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T09:30:00"),
        arrivalTime: new Date("2025-01-15T11:15:00"),
        duration: "1h 45m",
        basePrice: 3500,
        currentPrice: 3500,
        seatsAvailable: 79
      },
      {
        flightId: "6E-1502",
        airline: "IndiGo",
        source: "Varanasi",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T14:00:00"),
        arrivalTime: new Date("2025-01-15T16:30:00"),
        duration: "2h 30m",
        basePrice: 4400,
        currentPrice: 4400,
        seatsAvailable: 88
      },

      // Amritsar Routes
      {
        flightId: "6E-1601",
        airline: "IndiGo",
        source: "Amritsar",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T07:00:00"),
        arrivalTime: new Date("2025-01-15T08:15:00"),
        duration: "1h 15m",
        basePrice: 2600,
        currentPrice: 2600,
        seatsAvailable: 105
      },
      {
        flightId: "UK-1602",
        airline: "Vistara",
        source: "Amritsar",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T12:00:00"),
        arrivalTime: new Date("2025-01-15T14:30:00"),
        duration: "2h 30m",
        basePrice: 4300,
        currentPrice: 4300,
        seatsAvailable: 81
      },

      // Srinagar Routes
      {
        flightId: "AI-1701",
        airline: "Air India",
        source: "Srinagar",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T08:30:00"),
        arrivalTime: new Date("2025-01-15T10:00:00"),
        duration: "1h 30m",
        basePrice: 3700,
        currentPrice: 3700,
        seatsAvailable: 72
      },
      {
        flightId: "6E-1702",
        airline: "IndiGo",
        source: "Srinagar",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T13:30:00"),
        arrivalTime: new Date("2025-01-15T16:15:00"),
        duration: "2h 45m",
        basePrice: 5200,
        currentPrice: 5200,
        seatsAvailable: 68
      },

      // Dehradun Routes
      {
        flightId: "6E-1801",
        airline: "IndiGo",
        source: "Dehradun",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T06:30:00"),
        arrivalTime: new Date("2025-01-15T07:30:00"),
        duration: "1h 00m",
        basePrice: 2400,
        currentPrice: 2400,
        seatsAvailable: 96
      },
      {
        flightId: "SG-1802",
        airline: "SpiceJet",
        source: "Dehradun",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T11:00:00"),
        arrivalTime: new Date("2025-01-15T13:30:00"),
        duration: "2h 30m",
        basePrice: 4100,
        currentPrice: 4100,
        seatsAvailable: 89
      },

      // Guwahati Routes
      {
        flightId: "AI-1901",
        airline: "Air India",
        source: "Guwahati",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T09:00:00"),
        arrivalTime: new Date("2025-01-15T11:45:00"),
        duration: "2h 45m",
        basePrice: 5100,
        currentPrice: 5100,
        seatsAvailable: 75
      },
      {
        flightId: "6E-1902",
        airline: "IndiGo",
        source: "Guwahati",
        destination: "Kolkata",
        departureTime: new Date("2025-01-15T14:00:00"),
        arrivalTime: new Date("2025-01-15T15:15:00"),
        duration: "1h 15m",
        basePrice: 3200,
        currentPrice: 3200,
        seatsAvailable: 92
      },

      // Ranchi Routes
      {
        flightId: "6E-2001",
        airline: "IndiGo",
        source: "Ranchi",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T08:00:00"),
        arrivalTime: new Date("2025-01-15T10:15:00"),
        duration: "2h 15m",
        basePrice: 3900,
        currentPrice: 3900,
        seatsAvailable: 86
      },
      {
        flightId: "SG-2002",
        airline: "SpiceJet",
        source: "Ranchi",
        destination: "Kolkata",
        departureTime: new Date("2025-01-15T13:00:00"),
        arrivalTime: new Date("2025-01-15T14:00:00"),
        duration: "1h 00m",
        basePrice: 2500,
        currentPrice: 2500,
        seatsAvailable: 98
      },

      // Raipur Routes
      {
        flightId: "6E-2101",
        airline: "IndiGo",
        source: "Raipur",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T07:30:00"),
        arrivalTime: new Date("2025-01-15T09:30:00"),
        duration: "2h 00m",
        basePrice: 3700,
        currentPrice: 3700,
        seatsAvailable: 83
      },
      {
        flightId: "AI-2102",
        airline: "Air India",
        source: "Raipur",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T12:30:00"),
        arrivalTime: new Date("2025-01-15T14:30:00"),
        duration: "2h 00m",
        basePrice: 3900,
        currentPrice: 3900,
        seatsAvailable: 77
      },

      // Vijayawada Routes
      {
        flightId: "6E-2201",
        airline: "IndiGo",
        source: "Vijayawada",
        destination: "Hyderabad",
        departureTime: new Date("2025-01-15T06:45:00"),
        arrivalTime: new Date("2025-01-15T07:45:00"),
        duration: "1h 00m",
        basePrice: 2300,
        currentPrice: 2300,
        seatsAvailable: 101
      },
      {
        flightId: "SG-2202",
        airline: "SpiceJet",
        source: "Vijayawada",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T11:30:00"),
        arrivalTime: new Date("2025-01-15T13:00:00"),
        duration: "1h 30m",
        basePrice: 3100,
        currentPrice: 3100,
        seatsAvailable: 94
      },

      // Visakhapatnam Routes
      {
        flightId: "AI-2301",
        airline: "Air India",
        source: "Visakhapatnam",
        destination: "Hyderabad",
        departureTime: new Date("2025-01-15T08:00:00"),
        arrivalTime: new Date("2025-01-15T09:15:00"),
        duration: "1h 15m",
        basePrice: 2700,
        currentPrice: 2700,
        seatsAvailable: 87
      },
      {
        flightId: "6E-2302",
        airline: "IndiGo",
        source: "Visakhapatnam",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T13:00:00"),
        arrivalTime: new Date("2025-01-15T15:45:00"),
        duration: "2h 45m",
        basePrice: 5000,
        currentPrice: 5000,
        seatsAvailable: 80
      },

      // Madurai Routes
      {
        flightId: "6E-2401",
        airline: "IndiGo",
        source: "Madurai",
        destination: "Chennai",
        departureTime: new Date("2025-01-15T07:00:00"),
        arrivalTime: new Date("2025-01-15T08:00:00"),
        duration: "1h 00m",
        basePrice: 2200,
        currentPrice: 2200,
        seatsAvailable: 104
      },
      {
        flightId: "AI-2402",
        airline: "Air India",
        source: "Madurai",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T12:00:00"),
        arrivalTime: new Date("2025-01-15T13:15:00"),
        duration: "1h 15m",
        basePrice: 2800,
        currentPrice: 2800,
        seatsAvailable: 91
      },

      // Trichy (Tiruchirappalli) Routes
      {
        flightId: "6E-2501",
        airline: "IndiGo",
        source: "Trichy",
        destination: "Chennai",
        departureTime: new Date("2025-01-15T09:30:00"),
        arrivalTime: new Date("2025-01-15T10:30:00"),
        duration: "1h 00m",
        basePrice: 2100,
        currentPrice: 2100,
        seatsAvailable: 107
      },
      {
        flightId: "SG-2502",
        airline: "SpiceJet",
        source: "Trichy",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T14:30:00"),
        arrivalTime: new Date("2025-01-15T16:45:00"),
        duration: "2h 15m",
        basePrice: 4000,
        currentPrice: 4000,
        seatsAvailable: 85
      },

      // Mangalore Routes
      {
        flightId: "AI-2601",
        airline: "Air India",
        source: "Mangalore",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T06:30:00"),
        arrivalTime: new Date("2025-01-15T07:30:00"),
        duration: "1h 00m",
        basePrice: 2400,
        currentPrice: 2400,
        seatsAvailable: 89
      },
      {
        flightId: "6E-2602",
        airline: "IndiGo",
        source: "Mangalore",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T11:00:00"),
        arrivalTime: new Date("2025-01-15T12:30:00"),
        duration: "1h 30m",
        basePrice: 3200,
        currentPrice: 3200,
        seatsAvailable: 96
      },

      // Udaipur Routes
      {
        flightId: "6E-2701",
        airline: "IndiGo",
        source: "Udaipur",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T08:00:00"),
        arrivalTime: new Date("2025-01-15T09:30:00"),
        duration: "1h 30m",
        basePrice: 3100,
        currentPrice: 3100,
        seatsAvailable: 82
      },
      {
        flightId: "UK-2702",
        airline: "Vistara",
        source: "Udaipur",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T13:00:00"),
        arrivalTime: new Date("2025-01-15T14:30:00"),
        duration: "1h 30m",
        basePrice: 3300,
        currentPrice: 3300,
        seatsAvailable: 78
      },

      // Jodhpur Routes
      {
        flightId: "SG-2801",
        airline: "SpiceJet",
        source: "Jodhpur",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T09:00:00"),
        arrivalTime: new Date("2025-01-15T10:30:00"),
        duration: "1h 30m",
        basePrice: 3000,
        currentPrice: 3000,
        seatsAvailable: 90
      },
      {
        flightId: "6E-2802",
        airline: "IndiGo",
        source: "Jodhpur",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T14:00:00"),
        arrivalTime: new Date("2025-01-15T15:45:00"),
        duration: "1h 45m",
        basePrice: 3500,
        currentPrice: 3500,
        seatsAvailable: 86
      },

      // Surat Routes
      {
        flightId: "6E-2901",
        airline: "IndiGo",
        source: "Surat",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T07:30:00"),
        arrivalTime: new Date("2025-01-15T09:15:00"),
        duration: "1h 45m",
        basePrice: 3400,
        currentPrice: 3400,
        seatsAvailable: 93
      },
      {
        flightId: "AI-2902",
        airline: "Air India",
        source: "Surat",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T12:00:00"),
        arrivalTime: new Date("2025-01-15T13:00:00"),
        duration: "1h 00m",
        basePrice: 2500,
        currentPrice: 2500,
        seatsAvailable: 102
      },

      // Vadodara Routes
      {
        flightId: "6E-3001",
        airline: "IndiGo",
        source: "Vadodara",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T08:30:00"),
        arrivalTime: new Date("2025-01-15T10:15:00"),
        duration: "1h 45m",
        basePrice: 3300,
        currentPrice: 3300,
        seatsAvailable: 88
      },
      {
        flightId: "SG-3002",
        airline: "SpiceJet",
        source: "Vadodara",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T13:30:00"),
        arrivalTime: new Date("2025-01-15T14:30:00"),
        duration: "1h 00m",
        basePrice: 2400,
        currentPrice: 2400,
        seatsAvailable: 99
      },

      // Agra Routes
      {
        flightId: "6E-3101",
        airline: "IndiGo",
        source: "Agra",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T09:00:00"),
        arrivalTime: new Date("2025-01-15T10:00:00"),
        duration: "1h 00m",
        basePrice: 2200,
        currentPrice: 2200,
        seatsAvailable: 95
      },
      {
        flightId: "AI-3102",
        airline: "Air India",
        source: "Agra",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T14:00:00"),
        arrivalTime: new Date("2025-01-15T16:00:00"),
        duration: "2h 00m",
        basePrice: 3800,
        currentPrice: 3800,
        seatsAvailable: 81
      },

      // Thiruvananthapuram Routes
      {
        flightId: "6E-3201",
        airline: "IndiGo",
        source: "Thiruvananthapuram",
        destination: "Bangalore",
        departureTime: new Date("2025-01-15T06:00:00"),
        arrivalTime: new Date("2025-01-15T07:30:00"),
        duration: "1h 30m",
        basePrice: 2900,
        currentPrice: 2900,
        seatsAvailable: 97
      },
      {
        flightId: "AI-3202",
        airline: "Air India",
        source: "Thiruvananthapuram",
        destination: "Mumbai",
        departureTime: new Date("2025-01-15T11:00:00"),
        arrivalTime: new Date("2025-01-15T13:15:00"),
        duration: "2h 15m",
        basePrice: 4100,
        currentPrice: 4100,
        seatsAvailable: 84
      },

      // Shimla (via nearest airport Shimla/Jubbarhatti or Chandigarh hub)
      {
        flightId: "UK-3301",
        airline: "Vistara",
        source: "Shimla",
        destination: "Delhi",
        departureTime: new Date("2025-01-15T10:00:00"),
        arrivalTime: new Date("2025-01-15T11:15:00"),
        duration: "1h 15m",
        basePrice: 3200,
        currentPrice: 3200,
        seatsAvailable: 70
      }
    ];

    await Flight.insertMany(flights);
    console.log("✅ 77 Flights Seeded Successfully");
    process.exit();
  })
  .catch(err => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });
