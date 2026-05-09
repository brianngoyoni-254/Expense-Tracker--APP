import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 h-screen">

        {/* ONLY SCROLL CONTAINER */}
        <div className="flex-1 p-6 overflow-y-auto">

          <Outlet />

        </div>

        {/* FOOTER */}
        <footer className="text-center text-sm text-gray-500 py-4 border-t bg-white">
          Made by brian @ 2026
        </footer>

      </div>

    </div>
  );
}