import { useMemo } from "react";
import SmartSearch from "../components/SmartSearch";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard({
  transactions = [],
  search = "",
  setSearch = () => {},
  sortType = "",
  setSortType = () => {},
}) {

  
  const getAmount = (t) => Number(t?.amount || 0);

  const getDate = (t) => new Date(t?.date || 0);

  // Separate income transactions
  const income = useMemo(
    () => (Array.isArray(transactions)
      ? transactions.filter((t) => t?.type === "income")
      : []),
    [transactions]
  );

  // Separate expense transactions
  const expenses = useMemo(
    () => (Array.isArray(transactions)
      ? transactions.filter((t) => t?.type === "expense")
      : []),
    [transactions]
  );

  // Filter + sort expenses based on search & sortType
  const processedExpenses = useMemo(() => {
    let data = [...expenses];

    if (search?.trim()) {
      const s = search.toLowerCase();

      data = data.filter((e) =>
        (e.title || "").toLowerCase().includes(s) ||
        (e.category || "").toLowerCase().includes(s) ||
        (e.description || "").toLowerCase().includes(s) ||
        (e.wallet || "").toLowerCase().includes(s)
      );
    }

    if (sortType === "amount") {
      data.sort((a, b) => getAmount(b) - getAmount(a));
    }

    if (sortType === "date") {
      data.sort((a, b) => getDate(b) - getDate(a));
    }

    if (sortType === "category") {
      data.sort((a, b) =>
        (a.category || "").localeCompare(b.category || "")
      );
    }

    return data;
  }, [expenses, search, sortType]);

  
  const totalIncome = income.reduce((s, t) => s + getAmount(t), 0);

  const totalExpenses = expenses.reduce((s, t) => s + getAmount(t), 0);


  const balance = totalIncome - totalExpenses;

  //  Savings percentage
  const savingsRate =
    totalIncome > 0
      ? ((balance / totalIncome) * 100).toFixed(1)
      : 0;

  // Prepare chart dataset (income vs expense per date)
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    const map = {};

    transactions.forEach((t) => {
      const date = t.date || "unknown";

      if (!map[date]) {
        map[date] = {
          date,
          income: 0,
          expense: 0,
        };
      }

      if (t.type === "income") {
        map[date].income += getAmount(t);
      }

      if (t.type === "expense") {
        map[date].expense += getAmount(t);
      }
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions]);

  //  latest 10 transactions
  const recentTransactions = useMemo(() => {
    if (!transactions.length) return [];

    return [...transactions]
      .sort((a, b) => getDate(b) - getDate(a))
      .slice(0, 10);
  }, [transactions]);

  return (
    <div className="space-y-6">

      {/*Sticky search + sort header */}
      <div className="sticky top-0 z-50 w-full bg-gray-100">

        <div className="w-full bg-white px-4 py-4 rounded-2xl shadow">
          <SmartSearch
            search={search}
            setSearch={setSearch}
            sortType={sortType}
            setSortType={setSortType}
            expenses={expenses}
          />
        </div>

      </div>

      {/* Summary statistics cards */}
      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Balance</h3>
          <p className="text-blue-600 text-2xl font-bold">
            KES {balance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Income</h3>
          <p className="text-green-600 text-2xl font-bold">
            KES {totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Expenses</h3>
          <p className="text-red-600 text-2xl font-bold">
            KES {totalExpenses.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Savings</h3>
          <p className="text-purple-600 text-2xl font-bold">
            {savingsRate}%
          </p>
        </div>

      </div>

      {/* Charts section (income vs expense trend) */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Bar chart */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold mb-3">
            Income vs Expenses (Daily)
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold mb-3">
            Cash Flow Trend
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Expense list (filtered + scrollable container) */}
      <div className="bg-white p-4 rounded-2xl shadow">

        <h3 className="font-bold mb-3">
          Expenses ({processedExpenses.length})
        </h3>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">

          {processedExpenses.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No expenses yet
            </p>
          ) : (
            processedExpenses.map((e) => (
              <div key={e.id} className="border p-3 rounded">

                <p className="font-bold">
                  {e.title} • {e.category}
                </p>

                <p className="text-sm text-gray-600">
                  {e.description}
                </p>

                <p className="text-green-600 font-bold">
                  KES {Number(e.amount || 0).toLocaleString()}
                </p>

                <p className="text-xs text-gray-400">
                  {e.date}
                </p>

              </div>
            ))
          )}

        </div>
      </div>

      {/* Recent transactions table (latest activity view) */}
      <div className="bg-white p-4 rounded-2xl shadow">

        <h3 className="font-bold mb-3">
          Recent Transactions
        </h3>

        <div className="max-h-[320px] overflow-y-auto">

          {recentTransactions.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No transactions yet
            </p>
          ) : (
            <table className="w-full text-sm">

              <thead>
                <tr className="border-b text-left">
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Wallet</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b">

                    <td>{t.title}</td>
                    <td>{t.type}</td>
                    <td>{t.category || "—"}</td>
                    <td className="text-blue-600 font-bold">
                      {t.wallet || "default"}
                    </td>
                    <td>KES {Number(t.amount || 0).toLocaleString()}</td>
                    <td>{t.date}</td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>
      </div>

    </div>
  );
}