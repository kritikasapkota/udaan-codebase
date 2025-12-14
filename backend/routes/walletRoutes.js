const express = require("express");
const router = express.Router();
const {
  getWallet,
  addFunds,
  getHistory
} = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getWallet);
router.post("/add", authMiddleware, addFunds);
router.get("/history", authMiddleware, getHistory);

module.exports = router;
