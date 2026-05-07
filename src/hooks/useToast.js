import { useState, useRef } from "react";

export default function useToast() {
  const [toasts, setToasts] = useState([]);
  const ref = useRef(toasts);
  ref.current = toasts;

  const showToast = (message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const ToastContainer = () => (
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

  return { showToast, ToastContainer };
}