const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    balance: {
      type: Number,
      default: 50000   // PDF requirement
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
