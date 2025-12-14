import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";

const COLORS = ["#10B981", "#EF4444"];

export default function WalletAnalytics({ transactions = [] }) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return null;
  }

  /* ---------- BASIC TOTALS ---------- */
  const totalCredit = transactions
    .filter(t => t.type === "CREDIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === "DEBIT")
    .reduce((sum, t) => sum + t.amount, 0);

  const summaryData = [
    { name: "Added", value: totalCredit },
    { name: "Spent", value: totalDebit }
  ];

  /* ---------- MONTHLY AGGREGATION ---------- */
  const monthlyMap = {};

  transactions.forEach(tx => {
    const date = new Date(tx.timestamp);
    const month = date.toLocaleString("en-IN", {
      month: "short",
      year: "numeric"
    });

    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, CREDIT: 0, DEBIT: 0 };
    }

    monthlyMap[month][tx.type] += tx.amount;
  });

  const monthlyData = Object.values(monthlyMap);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 space-y-10">

      <h3 className="text-xl font-semibold">Wallet Analytics</h3>

      {/* ---------- PIE + BAR ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={summaryData}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {summaryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {summaryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------- MONTHLY LINE CHART ---------- */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="CREDIT"
              stroke="#10B981"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="DEBIT"
              stroke="#EF4444"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
