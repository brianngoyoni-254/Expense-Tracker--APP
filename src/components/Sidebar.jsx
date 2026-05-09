import { NavLink } from "react-router-dom";

export default function Sidebar() {

  const items = [
    {
      path: "/",
      label: "Dashboard",
    },
    {
      path: "/add-expense",
      label: "Add Expense",
    },
    {
      path: "/expenses",
      label: "Expenses",
    },
    {
      path: "/wallets",
      label: "Wallets",
    },
    {
      path: "/income",
      label: "Income",
    },
    {
      path: "/transactions",
      label: "Transactions",
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">

      <h1 className="text-2xl font-bold mb-8">
        Expense Tracker
      </h1>

      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}

          className={({ isActive }) =>
            `block p-3 rounded-lg mb-2 transition ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}

    </div>
  );
}