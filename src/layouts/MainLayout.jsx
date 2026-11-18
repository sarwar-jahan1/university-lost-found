
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 py-6 text-center text-sm text-slate-300">
        © 2026 Campus Lost & Found. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
