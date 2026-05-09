import { useState } from "react";

export default function Expenses({
  expenses = [],
  handleDelete,
  handleEdit,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const API_URL = "http://localhost:3001/transactions";

  // START EDIT
  const startEdit = (expense) => {
    setEditingId(expense.id);

    setEditForm({
      ...expense,
    });
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // SAVE EDIT
  const saveEdit = async () => {
    try {
      const payload = {
        ...editForm,
        amount: Number(editForm.amount || 0),
      };

      const res = await fetch(
        `${API_URL}/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Update failed");
      }

      // refresh parent data
      handleEdit?.();

      // exit edit mode
      setEditingId(null);

      setEditForm({});

      alert("Expense updated successfully");
    } catch (err) {
      console.log(err);

      alert("Failed to update expense");
    }
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // DELETE CONFIRM
  const confirmDelete = (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmAction) return;

    handleDelete?.(id);
  };

  return (
    <div className="h-[calc(100vh-100px)] overflow-y-auto">

      <h2 className="text-2xl font-bold mb-4">
        All Expenses
      </h2>

      {/* EMPTY */}
      {(expenses || []).length === 0 ? (
        <p className="text-gray-500">
          No expenses found
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {(expenses || []).map((e) => (
            <div
              key={e.id}
              className="bg-white p-4 rounded shadow"
            >

              {/* EDIT MODE */}
              {editingId === e.id ? (
                <div className="space-y-2">

                  <input
                    name="title"
                    value={editForm.title || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="Title"
                  />

                  <input
                    name="category"
                    value={editForm.category || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="Category"
                  />

                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="Amount"
                  />

                  <input
                    type="date"
                    name="date"
                    value={editForm.date || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                  />

                  <textarea
                    name="description"
                    value={editForm.description || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                    placeholder="Description"
                  />

                  <div className="flex gap-2 mt-2">

                    <button
                      onClick={saveEdit}
                      className="bg-green-500 px-3 py-1 text-white rounded"
                    >
                      Save
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 px-3 py-1 text-white rounded"
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              ) : (
                /* VIEW MODE */
                <>
                  <h3 className="font-bold text-lg">
                    {e.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {e.category} • {e.date}
                  </p>

                  <p className="mt-2 text-gray-700">
                    {e.description}
                  </p>

                  <p className="mt-2 font-bold text-red-600">
                    KES {Number(e.amount || 0).toLocaleString()}
                  </p>

                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={() => startEdit(e)}
                      className="bg-yellow-500 px-3 py-1 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => confirmDelete(e.id)}
                      className="bg-red-500 px-3 py-1 text-white rounded"
                    >
                      Delete
                    </button>

                  </div>
                </>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}