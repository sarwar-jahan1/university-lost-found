
import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../services/authService";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  const user = getCurrentUser();

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Browse Items", path: "/items" },
    { name: "Report Item", path: "/report-item" },
    { name: "Track Claim", path: "/track-claim" },
  ];

  const userName =
    user?.name || user?.email?.split("@")[0] || "Student";

  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    logoutUser();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/", { replace: true });
  };

  // Navigation link styles
  const linkClass = ({ isActive }) =>
    `relative rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">

      <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* LEFT: LOGO */}
        <Link
          to="/home"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-lg font-extrabold text-white shadow-md shadow-blue-200 transition-transform duration-200 group-hover:scale-105">
            LF
          </div>

          <div className="hidden sm:block">
            <h1 className="text-[17px] font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
              Campus Lost & Found
            </h1>
            <p className="mt-0.5 text-xs font-medium tracking-wide text-slate-500">
              Find what matters
            </p>
          </div>
        </Link>

        {/* CENTER: DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT: USER PROFILE */}
        <div className="relative hidden md:block" ref={profileRef}>

          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-expanded={profileOpen}
            aria-label="Open user profile menu"
            className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition-all duration-200 ${
              profileOpen
                ? "border-blue-200 bg-blue-50"
                : "border-transparent hover:border-slate-200 hover:bg-slate-50"
            }`}
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm font-bold text-blue-700 ring-2 ring-white">
              {userInitial}
            </div>

            {/* User name */}
            <div className="max-w-36 text-left">
              <p className="truncate text-sm font-bold text-slate-800">
                {userName}
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Student
              </p>
            </div>

            {/* Dropdown Arrow */}
            <svg
              className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </button>

          {/* PROFILE DROPDOWN */}
          {profileOpen && (
            <div className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">

              {/* Profile Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white shadow-md">
                    {userInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-semibold text-slate-600">
                    Logged in
                  </span>
                </div>
              </div>

              {/* Dropdown Actions */}
              <div className="p-2">
                <div className="px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Account
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </span>

                  <span>Logout</span>

                  <svg
                    className="ml-auto h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg md:hidden">

          {/* Mobile User Info */}
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {userInitial}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">
                {userName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-1">
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
          </div>

          {/* Mobile Logout */}
          <div className="mt-4 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
