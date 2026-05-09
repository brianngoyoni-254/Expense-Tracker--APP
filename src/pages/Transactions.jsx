export default function Transactions({
  transactions = [],
  wallets = [],
}) {

  // NORMALIZE
  const normalize = (v) =>
    (v || "")
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-");

  // GET WALLET NAME
  const getWalletName = (walletId) => {
    const found = wallets.find(
      (w) => normalize(w.id) === normalize(walletId)
    );

    return found?.name || walletId || "—";
  };

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">
        All Transactions
      </h2>

      {/* EMPTY STATE */}
      {!transactions || transactions.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-gray-500">
          No transactions yet. Everything starts at zero.
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">

          <div className="max-h-[420px] overflow-y-auto">

            <table className="w-full text-sm">

              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Wallet</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>

              <tbody>

                {transactions.map((t) => (
                  <tr key={t.id} className="border-b">

                    <td className="text-xs text-gray-500 p-2">
                      {t.id}
                    </td>

                    <td
                      className={
                        t.type === "income"
                          ? "text-green-600 font-bold p-2"
                          : "text-red-600 font-bold p-2"
                      }
                    >
                      {t.type || "—"}
                    </td>

                    <td className="p-2">
                      {t.title || "—"}
                    </td>

                    <td className="p-2">
                      {t.category || "—"}
                    </td>

                    <td className="font-bold text-blue-600 p-2">
                      {getWalletName(t.wallet)}
                    </td>

                    <td className="font-medium p-2">
                      KES {Number(t.amount || 0).toLocaleString()}
                    </td>

                    <td className="text-gray-500 p-2">
                      {t.date || "—"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}