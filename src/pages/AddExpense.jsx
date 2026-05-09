import { useState, useMemo } from "react";

export default function AddExpense({
  expenses = [],
  fetchExpenses,
  showToast,
  fetchTransactions,
  wallets = [],
}) {
  const API_URL = "http://localhost:3001/expenses";
  const TRANSACTIONS_URL = "http://localhost:3001/transactions";

  const initialForm = {
    title: "",
    description: "",
    category: "",
    amount: "",
    date: "",
    wallet: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [customCategory, setCustomCategory] = useState("");
  const [errors, setErrors] = useState({});

  // CATEGORIES
  
  const categories = useMemo(() => {
    if (!Array.isArray(expenses)) return [];

    return [
      ...new Set(
        expenses
          .map((e) => e?.category)
          .filter((c) => typeof c === "string" && c.trim() !== "")
      ),
    ];
  }, [expenses]);

  // VALIDATION
  
  const validateField = (name, value) => {
    let error = "";
    const v = value ?? "";

    if (v.toString().trim() === "") {
      error = "Required";
    }

    if (name === "amount") {
      if (!v || Number(v) <= 0) {
        error = "Invalid amount";
      }
    }

    if (name === "wallet") {
      if (!v) {
        error = "Please select a wallet";
      }
    }

    setErrors((p) => ({ ...p, [name]: error }));

    return error === "";
  };

  const validateForm = () => {
    const a = validateField("title", formData.title);
    const b = validateField("description", formData.description);
    const c = validateField("amount", formData.amount);
    const d = validateField("date", formData.date);

    const categoryValue =
      formData.category === "__new"
        ? customCategory
        : formData.category;

    const e = validateField("category", categoryValue);

    const walletValid = validateField("wallet", formData.wallet);

    return a && b && c && d && e && walletValid;
  };

  
  // HANDLERS
  
  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };


  // DELETE CATEGORY
  
  const handleDeleteCategory = async (category) => {
    try {
      const updated = expenses.map((e) =>
        e.category === category
          ? { ...e, category: "uncategorized" }
          : e
      );

      await Promise.all(
        updated.map((e) =>
          fetch(`${API_URL}/${e.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(e),
          })
        )
      );

      showToast?.success?.("Category deleted");

      fetchExpenses?.();
      fetchTransactions?.();
    } catch {
      showToast?.error?.("Failed to delete category");
    }
  };

  
  // SUBMIT
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast?.error?.("Please fill all fields correctly");
      return;
    }

    const finalCategory =
      formData.category === "__new"
        ? customCategory
        : formData.category;

    const payload = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: finalCategory,
      amount: Number(formData.amount),
      date: formData.date,
      type: "expense",
      wallet: formData.wallet,
    };

    try {
      // SAVE TO EXPENSES
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // SAVE TO TRANSACTIONS
      await fetch(TRANSACTIONS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showToast?.success?.("Expense saved");

      setFormData(initialForm);
      setCustomCategory("");
      setErrors({});

      fetchExpenses?.();
      fetchTransactions?.();
    } catch {
      showToast?.error?.("Failed to save expense");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Add Expense
      </h2>

      {/* CATEGORY LIST */}
      <div className="bg-white p-3 mb-4 rounded shadow">
        <h3 className="font-bold mb-2">Categories</h3>

        <div className="flex flex-wrap gap-2">
          {categories.map((c, i) => (
            <div
              key={i}
              className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2"
            >
              <span>{c}</span>

              <button
                onClick={() => handleDeleteCategory(c)}
                className="text-red-500 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-3">

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Title"
          className="border p-2 rounded"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>

          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}

          <option value="__new">Add New</option>
        </select>

        {formData.category === "__new" && (
          <input
            value={customCategory}
            onChange={(e) =>
              setCustomCategory(e.target.value)
            }
            placeholder="New category"
            className="border p-2 rounded"
          />
        )}

        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Amount"
          className="border p-2 rounded"
        />

        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          onBlur={handleBlur}
          className="border p-2 rounded"
        />

        {/* WALLET SELECT */}
        <select
          name="wallet"
          value={formData.wallet}
          onChange={handleChange}
          onBlur={handleBlur}
          className="border p-2 rounded"
        >
          <option value="">Select Wallet</option>

          {wallets.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>

        {errors.wallet && (
          <p className="text-red-500 text-sm">
            {errors.wallet}
          </p>
        )}

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Description"
          className="border p-2 rounded"
        />

        <button className="bg-blue-500 text-white p-2 rounded">
          Save Expense
        </button>
      </form>
    </div>
  );
}