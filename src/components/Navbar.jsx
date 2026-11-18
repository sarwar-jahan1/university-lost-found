
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  getCurrentUser,
  logoutUser,
} from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(() => getCurrentUser());

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Student";

  const displayEmail = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Browse Items", path: "/items" },
    { name: "Report Item", path: "/report-item" },
    { name: "Track Claim", path: "/track-claim" },
  ];

  const handleLogout = () => {
    logoutUser();

    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);

    // Reload the application after logout
    window.location.replace("/auth");
  };

  const linkClass = ({ isActive }) =>
    `rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-extrabold text-white shadow-md">
            LF
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              Campus Lost & Found
            </h1>
            <p className="text-sm text-slate-500">
              Find what matters
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Profile */}
        <div className="relative hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {initial}
                </div>

                <div className="max-w-40 text-left">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {displayName}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {displayEmail || "Student"}
                  </p>
                </div>

                <span className="text-slate-500">⌄</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {displayEmail}
                    </p>
                  </div>

                  <NavLink
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    My Profile
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xl text-slate-700 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 border-t border-slate-200 pt-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {displayEmail}
                    </p>
                  </div>
                </div>

                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  My Profile
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 w-full rounded-lg bg-red-50 px-4 py-2.5 text-left text-sm font-semibold text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
