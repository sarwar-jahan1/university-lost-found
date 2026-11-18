import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../services/api";
import { getCurrentUser } from "../services/authService";
import StatusBadge from "../components/ui/StatusBadge";
import { Skeleton } from "../components/ui/Skeleton";
import {
  ArrowIcon,
  CalendarIcon,
  PinIcon,
} from "../components/ui/Icons";
import useDocumentTitle from "../hooks/useDocumentTitle";
import ItemImage from "../components/ui/ItemImage";
import { applyNotificationDecisions } from "../utils/claims";
import {
  getNotifications,
  isNotificationRead,
} from "../services/notificationService";
import { getClaimItemId, getClaimItemTitle } from "../utils/claims";

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.claims)) return data.claims;
  return [];
};

const normalizeItem = (item) => {
  const type = String(item.type || item.status || "").toUpperCase();

  return {
    ...item,
    name: item.title || item.name || "Untitled Item",
    status: type === "LOST" ? "Lost" : type === "FOUND" ? "Found" : "Unknown",
    date: item.eventDate || item.date || "",
  };
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const quickActions = [
  {
    title: "Report an Item",
    text: "Lost or found something? Post a report.",
    to: "/report-item",
    color: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    path: "M12 5v14m-7-7h14",
  },
  {
    title: "Browse Items",
    text: "Search all reported items on campus.",
    to: "/items",
    color: "bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white",
    path: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 4 4",
  },
  {
    title: "Track My Claims",
    text: "See the status of your submitted claims.",
    to: "/track-claim",
    color: "bg-amber-50 text-amber-700 group-hover:bg-amber-500 group-hover:text-white",
    path: "M9 12l2 2 4-4m5 2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  },
];

const tips = [
  "Add the exact location and date — it makes matching much easier.",
  "Describe unique marks, colors or contents, but keep private details for the claim.",
  "Check Track Claim regularly to see when a claim is reviewed.",
];

const Dashboard = () => {
  useDocumentTitle("Dashboard");

  const user = getCurrentUser();
  const firstName = (
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "there"
  ).split(" ")[0];

  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [claimsError, setClaimsError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationsError, setNotificationsError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [itemsResult, claimsResult, notificationsResult] =
        await Promise.allSettled([
          apiRequest("/api/items/"),
          apiRequest("/api/claims/"),
          getNotifications(),
        ]);

      if (!active) return;

      if (itemsResult.status === "fulfilled") {
        setItems(
          toList(itemsResult.value)
            .map(normalizeItem)
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        );
      } else {
        setItemsError(
          itemsResult.reason?.message || "Failed to load items."
        );
      }

      if (claimsResult.status === "fulfilled") {
        setClaims(
          applyNotificationDecisions(
            toList(claimsResult.value),
            notificationsResult.status === "fulfilled"
              ? notificationsResult.value
              : []
          )
        );
      } else {
        setClaimsError(
          claimsResult.reason?.message || "Failed to load your claims."
        );
      }

      if (notificationsResult.status === "fulfilled") {
        setNotifications(notificationsResult.value);
      } else {
        setNotificationsError(
          notificationsResult.reason?.message ||
            "Failed to load notifications."
        );
      }

      setLoading(false);
    };

    load();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setItemsError("");
    setClaimsError("");
    setNotificationsError("");
    setReloadKey((key) => key + 1);
  };

  const claimStatus = (claim) =>
    String(claim.status || "PENDING").toUpperCase();

  const stats = [
    {
      label: "Total Reports",
      value: items.length,
      to: "/items",
      accent: "text-blue-700 bg-blue-50",
      error: itemsError,
    },
    {
      label: "Lost Items",
      value: items.filter((item) => item.status === "Lost").length,
      to: "/items?status=Lost",
      accent: "text-red-700 bg-red-50",
      error: itemsError,
    },
    {
      label: "Found Items",
      value: items.filter((item) => item.status === "Found").length,
      to: "/items?status=Found",
      accent: "text-emerald-700 bg-emerald-50",
      error: itemsError,
    },
    {
      label: "My Pending Claims",
      value: claims.filter((claim) => claimStatus(claim) === "PENDING")
        .length,
      to: "/track-claim",
      accent: "text-amber-700 bg-amber-50",
      error: claimsError,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-10">

      {/* Welcome banner */}
      <section className="animate-fade-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#101f49] via-[#1c3d89] to-[#292b78] p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-200">
              Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              {greeting()}, {firstName} 👋
            </h1>

            <p className="mt-2 max-w-xl text-sm text-blue-100/80 sm:text-base">
              Here is what is happening on campus today. Report an
              item or check on your claims.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/report-item"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              + Report an Item
            </Link>

            <Link
              to="/items"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        aria-label="Overview"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            {loading ? (
              <>
                <Skeleton className="h-8 w-12" />
                <Skeleton className="mt-3 h-4 w-24" />
              </>
            ) : (
              <>
                <p
                  className={`inline-block rounded-lg px-3 py-1 text-2xl font-extrabold ${stat.accent}`}
                >
                  {stat.error ? "–" : stat.value}
                </p>

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  {stat.label}
                </p>
              </>
            )}
          </Link>
        ))}
      </section>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <h2 className="mb-4 text-lg font-extrabold text-slate-900">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${action.color}`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d={action.path} />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900">
                  {action.title}
                </h3>
                <p className="text-sm text-slate-500">{action.text}</p>
              </div>

              <ArrowIcon className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">

        {/* Recent items */}
        <section
          aria-label="Recently reported items"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">
              Recently Reported
            </h2>

            <Link
              to="/items"
              className="text-sm font-bold text-blue-600 hover:text-blue-800"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((row) => (
                <Skeleton key={row} className="h-16 w-full" />
              ))}
            </div>
          ) : itemsError ? (
            <div role="alert" className="py-8 text-center">
              <p className="text-sm text-red-600">{itemsError}</p>
              <button
                type="button"
                onClick={reload}
                className="mt-3 text-sm font-semibold text-blue-600 underline"
              >
                Try Again
              </button>
            </div>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              No items have been reported yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/items/${item.id}`}
                    className="group -mx-2 flex items-center gap-4 rounded-lg px-2 py-3 transition hover:bg-slate-50"
                  >
                    <ItemImage
                      item={item}
                      className="h-14 w-14 shrink-0 rounded-lg"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-slate-900 group-hover:text-blue-700">
                          {item.name}
                        </p>

                        <StatusBadge
                          status={item.status}
                          className="shrink-0 !px-2 !py-0.5"
                        />
                      </div>

                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <PinIcon className="h-3.5 w-3.5" />
                          {item.location || "Location unavailable"}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          {formatDate(item.date)}
                        </span>
                      </p>
                    </div>

                    <ArrowIcon className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">

          {/* Notifications */}
          <section
            aria-label="Latest notifications"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
                Notifications
                {notifications.some((n) => !isNotificationRead(n)) && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    {notifications.filter((n) => !isNotificationRead(n)).length}
                  </span>
                )}
              </h2>

              <Link
                to="/notifications"
                className="text-sm font-bold text-blue-600 hover:text-blue-800"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : notificationsError ? (
              <p role="alert" className="py-4 text-center text-sm text-red-600">
                {notificationsError}
              </p>
            ) : notifications.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No notifications yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {notifications.slice(0, 3).map((notification) => {
                  const unread = !isNotificationRead(notification);

                  return (
                    <li key={notification.id}>
                      <Link
                        to="/notifications"
                        className={`flex gap-3 rounded-lg px-3 py-2.5 transition hover:bg-slate-100 ${
                          unread ? "bg-blue-50" : "bg-slate-50"
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            unread ? "bg-blue-600" : "bg-slate-300"
                          }`}
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {notification.title}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {notification.message}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* My claims */}
          <section
            aria-label="My recent claims"
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                My Claims
              </h2>

              <Link
                to="/track-claim"
                className="text-sm font-bold text-blue-600 hover:text-blue-800"
              >
                Track all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : claimsError ? (
              <p role="alert" className="py-4 text-center text-sm text-red-600">
                {claimsError}
              </p>
            ) : claims.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-slate-500">
                  You have not submitted any claims yet.
                </p>

                <Link
                  to="/items"
                  className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
                >
                  Find your item →
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {claims.slice(0, 4).map((claim) => {
                  const itemId = getClaimItemId(claim);
                  const itemTitle = getClaimItemTitle(claim);

                  return (
                    <li
                      key={claim.id}
                      className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">
                          Claim #{claim.id}
                        </p>

                        {itemId !== undefined && itemId !== null && (
                          <Link
                            to={`/items/${itemId}`}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            {itemTitle
                              ? `View ${itemTitle}`
                              : `View item ${itemId}`}
                          </Link>
                        )}
                      </div>

                      <StatusBadge status={claimStatus(claim)} />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Tips */}
          <section className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
            <h2 className="text-lg font-extrabold text-slate-900">
              💡 Tips
            </h2>

            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              {tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-0.5 text-blue-600">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
