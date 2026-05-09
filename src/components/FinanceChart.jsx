import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];

export default function FinanceChart({
  income,
  expenses,
}) {
  const pieData = [
    {
      name: "Income",
      value: income,
    },
    {
      name: "Expenses",
      value: expenses,
    },
  ];

  const barData = [
    {
      name: "Finance",
      Income: income,
      Expenses: expenses,
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* PIE */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-bold mb-4">
          Finance Overview
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BAR */}
      <div className="bg-white p-4 rounded-2xl shadow">
        <h2 className="font-bold mb-4">
          Income vs Expenses
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar
              dataKey="Income"
              fill="#22c55e"
            />

            <Bar
              dataKey="Expenses"
              fill="#ef4444"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}