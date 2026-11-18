
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ScrollManager from "../components/ui/ScrollManager";

const footerLinks = [
  { name: "Browse Items", path: "/items" },
  { name: "Report Item", path: "/report-item" },
  { name: "Track Claim", path: "/track-claim" },
  { name: "Notifications", path: "/notifications" },
  { name: "My Profile", path: "/profile" },
];

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <ScrollManager />

      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-extrabold text-white">
              LF
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Campus Lost & Found
              </p>
              <p className="text-xs text-slate-400">
                Helping belongings find their way home.
              </p>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="transition hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
          © 2026 Campus Lost & Found. All rights reserved.
        </div>
      </footer>
      </div>
    </div>
  );
};

export default MainLayout;
