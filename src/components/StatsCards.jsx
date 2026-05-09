export default function StatsCards({
  balance,
  income,
  expenses,
}) {
  const cards = [
    {
      title: "Balance",
      value: balance,
      color: "bg-blue-500",
    },
    {
      title: "Total Income",
      value: income,
      color: "bg-green-500",
    },
    {
      title: "Total Expenses",
      value: expenses,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} text-white p-6 rounded-2xl shadow`}
        >
          <h3 className="text-lg">
            {card.title}
          </h3>

          <p className="text-3xl font-bold mt-2">
            KES {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}