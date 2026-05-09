import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* MOBILE SIDEBAR OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static z-50 top-0 left-0 h-full
          transform transition-transform duration-300
          bg-white md:bg-transparent
          w-64 md:w-auto
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar closeSidebar={() => setOpen(false)} />
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 h-screen w-full">

        {/* TOP BAR (MOBILE ONLY MENU BUTTON) */}
        <div className="md:hidden flex items-center justify-between bg-white p-3 border-b">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-700 font-bold"
          >
            ☰ Menu
          </button>

          <p className="font-bold text-gray-700">
            Expense Tracker
          </p>
        </div>

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4">

          <Outlet />

        </div>

        {/* FOOTER */}
        <footer className="text-center text-xs sm:text-sm text-gray-500 py-3 sm:py-4 border-t bg-white">
          Made by brian @ 2026
        </footer>

      </div>

    </div>
  );
}