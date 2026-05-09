import { useState, useMemo, useEffect } from "react";

export default function Income({
  transactions = [],
  fetchTransactions,
  showToast,
  wallets = [],
}) {
  const API_URL = "http://localhost:3001/transactions";
  const INCOME_URL = "http://localhost:3001/income";

  
  // FORM
  
  const initialForm = {
    title: "",
    description: "",
    amount: "",
    date: "",
    wallet: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [localTransactions, setLocalTransactions] = useState([]);

  // FETCH TRANSACTIONS
  
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        setLocalTransactions(
          Array.isArray(data) ? data : []
        );
      } catch {
        setLocalTransactions([]);
      }
    };

    load();
  }, [transactions]);

  // FILTER INCOME
  
  const income = useMemo(() => {
    return localTransactions.filter(
      (t) => t?.type === "income"
    );
  }, [localTransactions]);

  
  // TOTAL INCOME
  
  const totalIncome = useMemo(() => {
    return income.reduce(
      (sum, t) => sum + Number(t?.amount || 0),
      0
    );
  }, [income]);

  
  // NORMALIZE
  
  const normalize = (v) =>
    (v || "")
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-");

  
  // INCOME PER WALLET
  
  const incomeByWallet = useMemo(() => {
    const map = {};

    income.forEach((t) => {
      const key = normalize(t.wallet);

      if (!key) return;

      if (!map[key]) {
        map[key] = 0;
      }

      map[key] += Number(t.amount || 0);
    });

    return map;
  }, [income]);

  
  // INPUT CHANGE
  
  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  
  // VALIDATION
  
  const validate = () => {
    if (
      !formData.title.trim() ||
      !formData.amount ||
      !formData.date ||
      !formData.wallet
    ) {
      return false;
    }

    return true;
  };

  
  // SAVE INCOME
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showToast?.error?.("Fill all fields");
      return;
    }

    const payload = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date,
      wallet: formData.wallet,
      type: "income",
    };

    try {
      // SAVE TO income
      await fetch(INCOME_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // SAVE TO transactions
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showToast?.success?.("Income saved");

      setFormData(initialForm);

      fetchTransactions?.();
    } catch {
      showToast?.error?.("Failed to save income");
    }
  };


  // UI
  
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <h1 className="text-2xl font-bold">
          Income
        </h1>

        <p className="text-green-600 font-bold mt-2">
          Total Income: KES{" "}
          {totalIncome.toLocaleString()}
        </p>

      </div>

      {/* WALLET BREAKDOWN */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="font-bold mb-3">
          Income per Wallet
        </h2>

        <div className="grid md:grid-cols-3 gap-3">

          {wallets.length === 0 ? (
            <p className="text-gray-500">
              No wallets available
            </p>
          ) : (
            wallets.map((w) => {
              const key = normalize(
                w.id || w.name
              );

              return (
                <div
                  key={w.id}
                  className="border p-3 rounded"
                >

                  <p className="font-bold text-blue-600">
                    {w.name}
                  </p>

                  <p className="text-green-600 font-bold">
                    KES {incomeByWallet[key] || 0}
                  </p>

                </div>
              );
            })
          )}

        </div>

      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <form
          onSubmit={handleSubmit}
          className="grid gap-3"
        >

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-2 rounded"
          />

          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded"
          />

          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {/* WALLETS */}
          <select
            name="wallet"
            value={formData.wallet}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">
              Select Wallet
            </option>

            {wallets.map((w) => (
              <option
                key={w.id}
                value={w.id}
              >
                {w.name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded"
          />

          <button className="bg-green-500 text-white p-2 rounded">
            Save Income
          </button>

        </form>

      </div>

      {/* LIST */}
      <div className="bg-white p-6 rounded-2xl shadow">

        {income.length === 0 ? (
          <p className="text-gray-500">
            No income yet
          </p>
        ) : (
          income.map((i) => (
            <div
              key={i.id}
              className="border p-3 rounded mb-2"
            >

              <p className="font-bold">
                {i.title}
              </p>

              <p className="text-green-600">
                KES {i.amount}
              </p>

              <p className="text-xs text-gray-500">
                Wallet: {i.wallet}
              </p>

            </div>
          ))
        )}

      </div>

    </div>
  );
}