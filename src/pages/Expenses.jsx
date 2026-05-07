import { useState } from "react";

export default function Expenses({
  expenses,
  handleDelete,
  handleEdit,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // START EDIT 
  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm(expense);
  };

  // HANDLE CHANGE 
  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // SAVE EDIT 
  const saveEdit = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/expenses/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editForm,
            amount: Number(editForm.amount),
          }),
        }
      );

      if (!res.ok) throw new Error();

      handleEdit(); // triggers toast + refresh in App.jsx

      setEditingId(null);
    } catch (err) {
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

    handleDelete(id); // App.jsx handles toast + refresh
  };

  // UI 
  return (
    <div className="h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">
        All Expenses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="bg-white p-4 rounded shadow"
          >
            {/* EDIT MODE */}
            {editingId === e.id ? (
              <div className="space-y-2">
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />

                <input
                  name="category"
                  value={editForm.category}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />

                <input
                  name="amount"
                  value={editForm.amount}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />

                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />

                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
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

                <p className="mt-2 font-bold text-green-600">
                  KES {e.amount}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(e)}
                    className="bg-yellow-500 px-3 py-1 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      confirmDelete(e.id)
                    }
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
    </div>
  );
}