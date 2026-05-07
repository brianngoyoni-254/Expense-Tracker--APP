export default function Sidebar({ page, setPage }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "add", label: "Add Expense" },
    { key: "expenses", label: "Expenses" },
  ];

  const handlePageChange = (key) => {
    // prevents unnecessary re-setting same page
    if (page !== key) {
      setPage(key);
    }
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-6">
        Expense App
      </h1>

      {items.map((item) => (
        <div
          key={item.key}
          onClick={() => handlePageChange(item.key)}
          className={`p-3 rounded-lg cursor-pointer mb-2 hover:bg-gray-700 transition ${
            page === item.key ? "bg-gray-700" : ""
          }`}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}