export default function TransactionsTable({
  transactions,
}) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">

      <h2 className="text-xl font-bold mb-4">
        Recent Transactions
      </h2>

      <table className="w-full border-collapse">

        <thead>
          <tr className="bg-gray-100 text-left">

            <th className="p-3">ID</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Description</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Wallet</th>
            <th className="p-3">Date</th>

          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b"
            >
              <td className="p-3">{t.id}</td>
              <td className="p-3">
                KES {t.amount}
              </td>

              <td className="p-3">
                {t.description}
              </td>

              <td className="p-3">
                {t.title}
              </td>

              <td className="p-3">
                {t.category}
              </td>

              <td className="p-3">
                {t.wallet}
              </td>

              <td className="p-3">
                {t.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}