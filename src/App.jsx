import { useEffect, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";

// REACT-TOASTIFY 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:3001/expenses";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);

  // GLOBAL SEARCH 
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");

  // FETCH EXPENSES 
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      toast.error("Failed to load expenses");
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  //  DELETE EXPENSE 
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  //  EDIT EXPENSE 
  const handleEdit = async (updatedExpense) => {
    try {
      const res = await fetch(`${API_URL}/${updatedExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedExpense),
      });

      if (!res.ok) throw new Error();

      toast.success("Expense updated successfully");
      fetchExpenses();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // RESET SEARCH WHEN PAGE CHANGES 
  useEffect(() => {
    setSearch("");
    setSortType("");
  }, [page]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar page={page} setPage={setPage} />

      {/* MAIN AREA */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* TOAST */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
        />

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <Dashboard
            expenses={expenses}
            search={search}
            setSearch={setSearch}
            sortType={sortType}
            setSortType={setSortType}
          />
        )}

        {/* ADD EXPENSE */}
        {page === "add" && (
          <AddExpense
            expenses={expenses}
            fetchExpenses={fetchExpenses}
          />
        )}

        {/* EXPENSES LIST */}
        {page === "expenses" && (
          <Expenses
            expenses={expenses}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        )}

      </div>
    </div>
  );
}