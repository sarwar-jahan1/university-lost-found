
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  getCurrentUser,
  logoutUser,
} from "../services/authService";
import useModal from "../hooks/useModal";
import {
  NOTIFICATIONS_CHANGED,
  getUnreadCount,
} from "../services/notificationService";

const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  className: "h-5 w-5 shrink-0",
  "aria-hidden": true,
};

const navLinks = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg {...icon}>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    name: "Browse Items",
    path: "/items",
    icon: (
      <svg {...icon}>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 4 4" />
      </svg>
    ),
  },
  {
    name: "Report Item",
    path: "/report-item",
    icon: (
      <svg {...icon}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    name: "My Reports",
    path: "/my-reports",
    icon: (
      <svg {...icon}>
        <path d="M8 3h8l4 4v14H4V3h4Zm0 8h8M8 15h8M8 7h2" />
      </svg>
    ),
  },
  {
    name: "Track Claim",
    path: "/track-claim",
    icon: (
      <svg {...icon}>
        <path d="M9 12l2 2 4-4M7 3h10a2 2 0 0 1 2 2v16l-7-3-7 3V5a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: (
      <svg {...icon}>
        <path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </svg>
    ),
  },
  {
    name: "My Profile",
    path: "/profile",
    icon: (
      <svg {...icon}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
];

const SidebarContent = ({ user, onLogout, unread = 0 }) => {
  const displayName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Student";

  const displayEmail = user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
        : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <Link
        to="/dashboard"
        className="flex items-center gap-3 px-5 py-6"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-base font-extrabold text-white shadow-lg shadow-blue-900/40">
          LF
        </div>

        <div className="leading-tight">
          <p className="text-base font-extrabold text-white">
            Campus Lost & Found
          </p>
          <p className="text-xs text-slate-400">Find what matters</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav aria-label="Main" className="flex-1 space-y-1 overflow-y-auto px-3">
        <p className="px-4 pb-2 pt-1 text-xs font-bold uppercase tracking-widest text-slate-500">
          Menu
        </p>

        {navLinks.map((link) => (
          <NavLink key={link.path} to={link.path} className={linkClass}>
            {link.icon}
            {link.name}

            {link.path === "/notifications" && unread > 0 && (
              <span
                className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white"
                aria-label={`${unread} unread notifications`}
              >
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-4">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 font-bold text-white">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {displayEmail || "Student"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
            >
              <svg {...icon} className="h-4 w-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/auth"
            className="block rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

const Drawer = ({ user, onLogout, onClose, unread }) => {
  useModal(onClose);

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <div
        className="animate-fade absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="animate-slide-left absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-slate-900 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10"
        >
          ✕
        </button>

        <SidebarContent user={user} onLogout={onLogout} unread={unread} />
      </aside>
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [user, setUser] = useState(() => getCurrentUser());

  // The drawer remembers the route it was opened on,
  // so it closes automatically after navigating.
  const [drawerPath, setDrawerPath] = useState(null);
  const drawerOpen = drawerPath === location.pathname;

  const [unread, setUnread] = useState(0);

  // Unread badge: refresh on navigation, every minute, and whenever a
  // notification is read.
  useEffect(() => {
    if (!user) return undefined;

    let active = true;

    const refresh = async () => {
      try {
        const count = await getUnreadCount();
        if (active) setUnread(count);
      } catch {
        // keep the last known count
      }
    };

    refresh();

    const timer = window.setInterval(refresh, 60000);
    window.addEventListener(NOTIFICATIONS_CHANGED, refresh);

    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener(NOTIFICATIONS_CHANGED, refresh);
    };
  }, [user, location.pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);

    // Reload the application after logout
    window.location.replace("/auth");
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 bg-slate-900 lg:block">
        <SidebarContent user={user} onLogout={handleLogout} unread={unread} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-extrabold text-white">
            LF
          </div>

          <span className="text-base font-extrabold text-slate-900">
            Campus Lost & Found
          </span>
        </Link>

        <div className="flex items-center gap-2">
        <Link
          to="/notifications"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="relative rounded-lg border border-slate-200 px-3 py-2 text-slate-700 transition hover:bg-slate-50"
        >
          <svg {...icon} className="h-5 w-5">
            <path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>

          {unread > 0 && (
            <span className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold leading-4 text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setDrawerPath(location.pathname)}
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xl text-slate-700 transition hover:bg-slate-50"
        >
          ☰
        </button>
        </div>
      </header>

      {drawerOpen && (
        <Drawer
          user={user}
          onLogout={handleLogout}
          unread={unread}
          onClose={() => setDrawerPath(null)}
        />
      )}
    </>
  );
};

export default Sidebar;
