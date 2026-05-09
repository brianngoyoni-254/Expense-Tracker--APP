import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Expenses from "./pages/Expenses";
import Wallets from "./pages/Wallets";
import Income from "./pages/Income";
import Transactions from "./pages/Transactions";

export default function App() {
  const API = "http://localhost:3001";

  
  // SINGLE SOURCE OF TRUTH
  
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);

  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");


  // MASTER SYNC FUNCTION

  const refreshAll = async () => {
    try {
      const [trxRes, walletRes] = await Promise.all([
        fetch(`${API}/transactions`),
        fetch(`${API}/wallets`),
      ]);

      const trxData = await trxRes.json();
      const walletData = await walletRes.json();

      setTransactions(
        Array.isArray(trxData) ? trxData : []
      );

      setWallets(
        Array.isArray(walletData) ? walletData : []
      );
    } catch (err) {
      console.log("Sync failed", err);
    }
  };

  
  // INITIAL LOAD
  
  useEffect(() => {
    refreshAll();
  }, []);

  
  // DELETE TRANSACTION
  
  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/transactions/${id}`, {
        method: "DELETE",
      });

      refreshAll();
    } catch (err) {
      console.log(err);
    }
  };

  
  // TOAST SYSTEM
  
  const showToast = {
    success: (msg) => alert(msg),
    error: (msg) => alert(msg),
    warning: (msg) => alert(msg),
  };

  
  // UI ROUTES
  
  return (
    <Routes>

      <Route
        path="/"
        element={<MainLayout />}
      >

        {/* DASHBOARD */}
        <Route
          index
          element={
            <Dashboard
              transactions={transactions}
              wallets={wallets}
              search={search}
              setSearch={setSearch}
              sortType={sortType}
              setSortType={setSortType}
            />
          }
        />

        {/* ADD EXPENSE */}
        <Route
          path="add-expense"
          element={
            <AddExpense
              expenses={transactions.filter(
                (t) => t.type === "expense"
              )}

              
              // PASS REAL WALLETS INTO AddExpense
              wallets={wallets}

              fetchExpenses={refreshAll}
              fetchTransactions={refreshAll}
              showToast={showToast}
            />
          }
        />

        {/* EXPENSES */}
        <Route
          path="expenses"
          element={
            <Expenses
              expenses={transactions.filter(
                (t) => t.type === "expense"
              )}
              handleDelete={handleDelete}
            />
          }
        />

        {/* WALLETS */}
        <Route
          path="wallets"
          element={
            <Wallets
              wallets={wallets}
              transactions={transactions}
              fetchWallets={refreshAll}
              showToast={showToast}
            />
          }
        />

        {/* INCOME */}
        <Route
          path="income"
          element={
            <Income
              transactions={transactions}
              wallets={wallets}
              fetchTransactions={refreshAll}
              showToast={showToast}
            />
          }
        />

        {/* TRANSACTIONS */}
        <Route
          path="transactions"
          element={
            <Transactions
              transactions={transactions}
            />
          }
        />

      </Route>

    </Routes>
  );
}