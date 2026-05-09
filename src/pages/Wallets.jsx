import { useState, useMemo } from "react";

export default function Wallets({
  wallets = [],
  transactions = [],
  fetchWallets,
  showToast,
}) {
  const API_URL = "http://localhost:3001/wallets";

  const [name, setName] = useState("");

  
  // NORMALIZE 
  const normalize = (v) =>
    (v || "").toString().toLowerCase().replace(/\s+/g, "-");

  // REAL-TIME WALLET CALCULATION 
  const enrichedWallets = useMemo(() => {
    return wallets.map((w) => {
      const walletKey = normalize(w.id || w.name);

      // strict match ONLY (prevents double counting / mismatch)
      const related = transactions.filter((t) => {
        const txWallet = normalize(t.wallet);
        return txWallet === walletKey;
      });

      const income = related
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount || 0), 0);

      const expenses = related
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount || 0), 0);

      const balance = income - expenses;

      return {
        ...w,
        income,
        expenses,
        balance,
      };
    });
  }, [wallets, transactions]);

  
  // ADD WALLET
  
  const addWallet = async () => {
    if (!name.trim()) {
      showToast?.error?.("Wallet name required");
      return;
    }

    const id = normalize(name);

    const exists = wallets.some(
      (w) => normalize(w.id || w.name) === id
    );

    if (exists) {
      showToast?.error?.("Wallet already exists");
      return;
    }

    const payload = {
      id,
      name,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      showToast?.success?.("Wallet added");

      setName("");
      fetchWallets?.();
    } catch {
      showToast?.error?.("Failed to add wallet");
    }
  };

  
  // DELETE WALLET
  
  const deleteWallet = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this wallet?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      showToast?.success?.("Wallet deleted");

      fetchWallets?.();
    } catch {
      showToast?.error?.("Failed to delete wallet");
    }
  };

  
  // UI
  
  return (
    <div className="space-y-6">

      {/* ADD WALLET */}
      <div className="bg-white p-6 rounded-2xl shadow flex gap-2">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New wallet name"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={addWallet}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Add
        </button>

      </div>

      {/* WALLET LIST */}
      <div className="grid md:grid-cols-3 gap-4">

        {enrichedWallets.length === 0 ? (
          <p className="text-gray-400">No wallets yet</p>
        ) : (
          enrichedWallets.map((w) => (
            <div key={w.id} className="bg-white p-4 rounded-2xl shadow">

              <h3 className="font-bold">{w.name}</h3>

              <p className="text-sm text-green-600">
                Income: KES {w.income.toLocaleString()}
              </p>

              <p className="text-sm text-red-500">
                Spent: KES {w.expenses.toLocaleString()}
              </p>

              <p className="text-blue-600 text-xl font-bold mt-1">
                Balance: KES {w.balance.toLocaleString()}
              </p>

              <button
                onClick={() => deleteWallet(w.id)}
                className="text-red-500 text-sm mt-2"
              >
                Delete
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
}