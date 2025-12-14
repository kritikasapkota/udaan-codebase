const User = require("../models/User");
const WalletTransaction = require("../models/WalletTransaction");

// GET WALLET BALANCE
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("walletBalance");
    res.json({ balance: user.walletBalance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ADD FUNDS
exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 🔥 ATOMIC DB UPDATE (THIS FIXES PERSISTENCE)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletBalance: Number(amount) } },
      { new: true } // return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await WalletTransaction.create({
      user: userId,
      amount: Number(amount),
      type: "CREDIT",
      description: "Added funds to wallet"
    });

    res.json({
      message: "Funds added successfully",
      balance: updatedUser.walletBalance
    });
  } catch (error) {
    console.error("Add funds error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// TRANSACTION HISTORY
exports.getHistory = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({
      user: req.user.id
    }).sort({ timestamp: -1 });

    res.json(transactions);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
