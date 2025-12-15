# ✈️ Udaan - Flight Booking System

A modern, full‑stack flight booking application with an integrated wallet system, built with the MERN stack and prepared for deployment on Render (backend) and Vercel (frontend).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

---

Table of contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Seed Data & Sample Credentials](#-seed-data--sample-credentials)
- [API Reference (examples)](#-api-reference-examples)
- [Deployment](#-deployment)
- [Testing & Health Checks](#-testing--health-checks)
- [Troubleshooting](#-troubleshooting)
- [Contributing & Governance](#-contributing--governance)
- [License & Author](#-license--author)
- [Acknowledgments](#-acknowledgments)
- [Support](#-support)

---

## 📝 Overview

This README is the canonical project overview for the repository:
https://github.com/kritikasapkota/udaan-codebase

It is written to be HR-friendly (clear installation steps, credentials for demo, and deployment notes). Keep secrets out of version control; use `.env` files and secret managers.

---

## 🌟 Features

Core:
- Flight search & booking (source, destination, date)
- JWT-based authentication and strong password policy
- Integrated digital wallet with transactions and analytics
- Booking management (view, cancel) and PNR tracking
- PDF ticket generation (downloadable)
- Responsive frontend with Tailwind CSS and Framer Motion

Security:
- Strong password requirements (server-side validation)
- JWT authentication and secured routes
- bcrypt password hashing
- CORS origin whitelisting

User Experience:
- Real-time password strength validation during registration
- Wallet transaction charts
- Printable PDF tickets

---

## 🏗️ Tech Stack

Frontend
- React 19, Vite, React Router, Axios, Tailwind CSS, Framer Motion, Recharts, Lucide React

Backend
- Node.js, Express, MongoDB (Atlas), Mongoose, JWT, bcryptjs, PDFKit, CORS

Deployment
- Vercel (frontend), Render (backend), MongoDB Atlas

---

## 📁 Project Structure

```
udaan-codebase/
├── backend/                # Express.js backend
│   ├── config/             # DB & config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth & validation middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/              # PDF generation & helpers
│   ├── public/logos/       # Static assets
│   ├── seed.js             # Database seeder
│   ├── server.js           # Entry point
│   ├── .env.example        # Env template
│   └── package.json        # Backend dependencies & scripts
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API service layer
│   │   ├── lib/            # Utilities
│   │   └── assets/         # Images, fonts
│   ├── public/             # Static files
│   ├── .env.example        # Env template
│   ├── vite.config.js      # Vite configuration
│   └── package.json        # Frontend dependencies & scripts
│
├── DEPLOYMENT_GUIDE.md     # Detailed deployment instructions
├── CONTRIBUTING.md         # Contribution guidelines
├── CODE_OF_CONDUCT.md      # Community guidelines
├── LICENSE                 # MIT License
├── package.json            # Root workspace scripts (install-all, dev)
└── README.md               # This file
```

Notes:
- The root package.json should include convenience scripts (see Quick Start). If you don't have them, follow the alternative commands shown below.

---

## 🚀 Quick Start

Prerequisites
- Node.js >= 16.0.0
- MongoDB Atlas account or local MongoDB
- npm (or yarn)

1) Clone the repository
```bash
git clone https://github.com/kritikasapkota/udaan-codebase.git
cd udaan-codebase
```

2) Install dependencies

Preferred (root workspace script)
```bash
npm run install-all
```

If root script is not present, install manually:
```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd ../frontend
npm install
```

3) Configure environment variables

Create backend `.env` from `backend/.env.example` and frontend `.env` from `frontend/.env.example`. Example values below.

4) Seed the database (optional, for demo/test)
```bash
cd backend
npm run seed
```

5) Run in development

Option A: Root concurrent script (if present)
```bash
npm run dev
```

Option B: Run separately
Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```

6) Access the app
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🔐 Environment Variables

Backend (`backend/.env`)
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/airplane_mgmt
JWT_SECRET=CHANGE_THIS_TO_A_STRONG_RANDOM_STRING
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

Security notes:
- Never commit production secrets. Use Render/Vercel secret settings or a secrets manager.
- Use a sufficiently long and random `JWT_SECRET` (e.g., 32+ chars).

---

## 🧾 Seed Data & Sample Credentials

The seeder creates demo users and sample flights for local testing. The seeded demo account password now follows the enforced strong password rules.

Demo credentials (for local/dev demo only)
- Email: `john@example.com`
- Password: `Udaan@2025!`  (meets requirements: 10 chars, uppercase, lowercase, number, special)

If you prefer weaker demo credentials for quick tests, explicitly document that these are development-only and NOT for production.

---

## 📦 API Reference (examples)

Authentication
- Register
  - POST /api/auth/register
  - Example curl:
    ```bash
    curl -X POST http://localhost:5000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{"name":"John Doe","email":"john@example.com","password":"Udaan@2025!"}'
    ```
  - Success: 201 Created with user object (no password) and token

- Login
  - POST /api/auth/login
  - Example curl:
    ```bash
    curl -X POST http://localhost:5000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"john@example.com","password":"Udaan@2025!"}'
    ```
  - Success: 200 OK with JWT token (store `token`)

Protected endpoints require Authorization header:
- Header: Authorization: Bearer <token>

Example: Get current user
```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/auth/me
```

Flights
- Search flights
  - GET /api/flights?source=DEL&destination=MUM&date=2025-12-25
  - Example:
    ```bash
    curl "http://localhost:5000/api/flights?source=DEL&destination=MUM&date=2025-12-25"
    ```

Bookings
- Create booking (protected)
  - POST /api/bookings
  - Body example:
    {
      "flightId": "<flightId>",
      "passengers": [{"name":"John Doe","age":30,"seat":"12A"}],
      "paymentMethod":"wallet" // or "card"
    }
  - Example curl:
    ```bash
    curl -X POST http://localhost:5000/api/bookings \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <token>" \
      -d '{"flightId":"<id>","passengers":[{"name":"John","age":30}],"paymentMethod":"wallet"}'
    ```

- Download ticket PDF
  - GET /api/bookings/:pnr/pdf
  - Example:
    ```bash
    curl -H "Authorization: Bearer <token>" http://localhost:5000/api/bookings/ABC123/pdf --output ticket.pdf
    ```

Wallet
- Get wallet balance
  - GET /api/wallet
- Add funds
  - POST /api/wallet/add
  - Body: { "amount": 1000 }

Responses & errors
- Standardized JSON response format:
  - Success: { success: true, data: ... }
  - Error: { success: false, error: "Error message" }
- Authentication protected endpoints return 401 Unauthorized if token is missing/invalid.
- Validation errors return 400 with details (e.g., password does not meet requirements).

For a full machine-readable API spec, consider adding an OpenAPI (Swagger) document in the repo.

---

## 🌐 Deployment

See DEPLOYMENT_GUIDE.md for step-by-step deployment. Quick overview:

Backend (Render)
1. Push to GitHub.
2. Create a Web Service on Render.
3. Set environment variables (MONGO_URI, JWT_SECRET, FRONTEND_URL).
4. Deploy from `main` branch.

Frontend (Vercel)
1. Import the GitHub repository in Vercel.
2. Set root directory to `frontend`.
3. Add `VITE_API_URL` environment variable.
4. Deploy.

MongoDB Atlas
1. Create free cluster (M0).
2. Configure network access (whitelist or allow current IP).
3. Create database user and use connection string in `MONGO_URI`.

---

## 🧪 Testing & Health Checks

Manual test workflow:
1. Register a new user with a strong password.
2. Login and capture token.
3. Search flights and create a booking.
4. Add funds to wallet and confirm balances.
5. Download PDF ticket and verify contents.
6. Cancel booking to test refund flow.

Backend health check:
```bash
curl https://<your-backend>.onrender.com/api/flights
# should return a JSON array of flights (200 OK)
```

---

## 🐛 Troubleshooting

Cannot connect to MongoDB:
- Verify `MONGO_URI` and Atlas network settings.
- Ensure DB user has correct permissions.

CORS errors:
- Check `FRONTEND_URL` in backend env matches frontend origin (no trailing slash).
- Inspect browser console for origin mismatch.

JWT auth fails:
- Ensure `JWT_SECRET` set in backend.
- Ensure the Authorization header is `Bearer <token>`.

Password validation errors:
- Password must be 8+ chars, contain uppercase, lowercase, number, and special char.
- Backend enforces rules even if frontend validation is bypassed.

Flights not showing:
- Run `npm run seed` (backend) to populate demo flights.
- Check `flights` collection in MongoDB.

---

## 🤝 Contributing & Governance

Contributions are welcome. Please follow:
1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m "Add AmazingFeature"`
4. Push and open a Pull Request.

Files to include in repo for community:
- CONTRIBUTING.md — contribution guidelines
- CODE_OF_CONDUCT.md — community behavior expectations
- ISSUE_TEMPLATE(s) — for bug/feature requests

Links:
- Issues: https://github.com/kritikasapkota/udaan-codebase/issues
- Contributing: https://github.com/kritikasapkota/udaan-codebase/blob/main/CONTRIBUTING.md (create this if missing)
- Code of Conduct: https://github.com/kritikasapkota/udaan-codebase/blob/main/CODE_OF_CONDUCT.md (create this if missing)

---

## 📄 License & Author

Licensed under the MIT License — see [LICENSE](https://github.com/kritikasapkota/udaan-codebase/blob/main/LICENSE).

Author: Udaan Flight Booking Team — repository maintained at https://github.com/kritikasapkota/udaan-codebase

---

## 🙏 Acknowledgments

- MongoDB Atlas, Vercel, Render
- React and Node.js communities

---

## 📞 Support

For issues or questions:
- Open an issue: https://github.com/kritikasapkota/udaan-codebase/issues
- Read DEPLOYMENT_GUIDE.md for deployment-specific help

---

Built with ❤️ using the MERN Stack
