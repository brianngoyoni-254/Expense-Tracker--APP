export default function Toast({ toasts }) {
  return (
    <div className="fixed top-4 left-4 z-[9999] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-xl text-white shadow ${
            t.type === "error"
              ? "bg-red-500"
              : t.type === "warning"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}