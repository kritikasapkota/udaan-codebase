import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WalletAnalytics from "../components/WalletAnalytics";
import { useAuth } from "../context/AuthContext";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  Plus,
  TrendingUp,
  AlertCircle
} from "lucide-react";

import { walletService } from "../services/api";
import { cn } from "../lib/utils";

export default function Wallet() {
  const { user, setUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [amountToAdd, setAmountToAdd] = useState("");
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  const [showAnalytics, setShowAnalytics] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        walletService.getBalance(),
        walletService.getTransactions()
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data);
    } catch (err) {
      console.error("Failed to fetch wallet data", err);
      setError("Could not load wallet details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const amount = parseFloat(amountToAdd);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      const res = await walletService.addFunds(amount);
      const newBalance = res.data.balance;
      
      // Update local state
      setBalance(newBalance);
      
      // Update user context and localStorage for navbar
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess(`Successfully added ₹${amount.toFixed(2)} to your wallet.`);
      setAmountToAdd("");
      setIsAddingFunds(false);
      fetchWalletData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add funds.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-sm md:text-base text-gray-500">Manage your funds and transactions</p>
        </div>

        {/* Balance + Add Funds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Balance Card */}
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white p-6 md:p-8 shadow-xl">
            <p className="text-purple-200 mb-2 text-sm md:text-base">Total Balance</p>
            <h2 className="text-4xl md:text-5xl font-bold">
              ₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </h2>

            <div className="mt-6 flex gap-3 md:gap-4 flex-wrap">
              <button
                onClick={() => setIsAddingFunds(true)}
                className="inline-flex items-center gap-2 bg-white text-purple-700 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold hover:bg-gray-100 transition text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                Add Funds
              </button>

              <button
                onClick={() => setShowAnalytics(prev => !prev)}
                className="inline-flex items-center gap-2 bg-purple-500/30 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-semibold backdrop-blur hover:bg-purple-500/40 transition text-sm md:text-base"
              >
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </button>
            </div>
          </div>

          {/* Add Funds Panel */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            {isAddingFunds ? (
              <form onSubmit={handleAddFunds} className="space-y-4">
                <label className="block text-sm font-medium text-gray-600">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Enter amount"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingFunds(false)}
                    className="flex-1 bg-gray-100 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 text-white py-2 rounded-xl"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-500 text-sm">
                Use the button on the left to add funds securely.
              </p>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg flex gap-2">
                <TrendingUp className="w-4 h-4" />
                {success}
              </div>
            )}
          </div>
        </div>

        {/* 🔥 Animated Analytics Section */}
        <AnimatePresence>
          {showAnalytics &&
            Array.isArray(transactions) &&
            transactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4 }}
              >
                <WalletAnalytics transactions={transactions} />
              </motion.div>
            )}
        </AnimatePresence>

        {/* Transaction History */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-6 border-b flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No transactions yet.
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="p-4 flex justify-between items-center border-b hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      tx.type === "CREDIT"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                    )}
                  >
                    {tx.type === "CREDIT" ? (
                      <ArrowDownCircle className="w-5 h-5" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <p
                  className={cn(
                    "font-bold",
                    tx.type === "CREDIT"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  )}
                >
                  {tx.type === "CREDIT" ? "+" : "-"}₹
                  {tx.amount.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
