import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getNotifications,
  isNotificationRead,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";
import { approveClaim, rejectClaim } from "../services/claimService";
import { ListRowSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/toastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

const DECISIONS_KEY = "campus_claim_decisions";

// The API has no "get claim" endpoint, so remember the decisions made on
// this device to keep showing "Approved" / "Rejected" after a refresh.
const loadDecisions = () => {
  try {
    return JSON.parse(localStorage.getItem(DECISIONS_KEY)) || {};
  } catch {
    return {};
  }
};

const saveDecision = (claimId, decision) => {
  try {
    localStorage.setItem(
      DECISIONS_KEY,
      JSON.stringify({ ...loadDecisions(), [claimId]: decision })
    );
  } catch {
    // storage unavailable: the decision still shows for this visit
  }
};

const TYPE_META = {
  CLAIM_SUBMITTED: {
    label: "New claim",
    circle: "bg-blue-100 text-blue-600",
    path: "M4 4h16v12H5.2L4 17.2V4Zm4 5h8M8 12h5",
  },
  CLAIM_APPROVED: {
    label: "Claim approved",
    circle: "bg-emerald-100 text-emerald-600",
    path: "m5 12 5 5 9-10",
  },
  CLAIM_REJECTED: {
    label: "Claim rejected",
    circle: "bg-red-100 text-red-600",
    path: "M6 6l12 12M18 6 6 18",
  },
};

const DEFAULT_META = {
  label: "Notification",
  circle: "bg-slate-100 text-slate-500",
  path: "M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7Zm4 10a2 2 0 0 0 4 0",
};

const timeAgo = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)} d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Notifications = () => {
  useDocumentTitle("Notifications");

  const navigate = useNavigate();
  const { notify } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [reloadKey, setReloadKey] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);
  const [decisions, setDecisions] = useState(loadDecisions);
  // { id, action } waiting for confirmation, and the claim being processed
  const [confirming, setConfirming] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const list = await getNotifications();
        if (active) setNotifications(list);
      } catch (err) {
        if (active) setError(err.message || "Unable to load notifications.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  const unreadCount = useMemo(
    () => notifications.filter((item) => !isNotificationRead(item)).length,
    [notifications]
  );

  const visible =
    filter === "unread"
      ? notifications.filter((item) => !isNotificationRead(item))
      : notifications;

  const setRead = (id) =>
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true, isRead: true } : item
      )
    );

  const markRead = useCallback(
    async (notification) => {
      if (isNotificationRead(notification)) return;

      setRead(notification.id);

      try {
        await markNotificationRead(notification.id);
      } catch (err) {
        // Put the unread state back if the server refused
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, read: false, isRead: false }
              : item
          )
        );
        notify(err.message || "Could not mark as read.", "error");
      }
    },
    [notify]
  );

  const handleMarkAll = async () => {
    try {
      setMarkingAll(true);
      await markAllNotificationsRead();

      setNotifications((current) =>
        current.map((item) => ({ ...item, read: true, isRead: true }))
      );
      notify("All notifications marked as read.", "success");
    } catch (err) {
      notify(err.message || "Could not mark all as read.", "error");
    } finally {
      setMarkingAll(false);
    }
  };

  const openNotification = async (notification) => {
    markRead(notification);

    const type = notification.type;

    if (type === "CLAIM_APPROVED" || type === "CLAIM_REJECTED") {
      navigate("/track-claim");
    } else if (notification.itemId) {
      navigate(`/items/${notification.itemId}`);
    }
  };

  const decide = async (notification, action) => {
    const claimId = notification.claimId;

    try {
      setProcessingId(notification.id);

      if (action === "approve") {
        await approveClaim(claimId);
      } else {
        await rejectClaim(claimId);
      }

      const decision = action === "approve" ? "APPROVED" : "REJECTED";

      saveDecision(claimId, decision);
      setDecisions((current) => ({ ...current, [claimId]: decision }));
      markRead(notification);

      notify(
        `Claim ${action === "approve" ? "approved" : "rejected"}.`,
        "success"
      );
    } catch (err) {
      // e.g. 409 "already processed" / 403 "not the reporter"
      notify(err.message || `Unable to ${action} this claim.`, "error");
    } finally {
      setProcessingId(null);
      setConfirming(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="animate-fade-up mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Notifications
          </h1>

          <p className="mt-2 text-slate-600">
            Updates about claims on your items and on claims you made.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAll}
          disabled={unreadCount === 0 || markingAll}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {markingAll ? "Marking..." : "✓ Mark all as read"}
        </button>
      </div>

      {/* Filter */}
      <div
        role="group"
        aria-label="Filter notifications"
        className="mb-5 flex gap-2"
      >
        {[
          { id: "all", label: `All (${notifications.length})` },
          { id: "unread", label: `Unread (${unreadCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              filter === tab.id
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-3" aria-busy="true" aria-label="Loading notifications">
          <ListRowSkeleton />
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 p-5 text-red-700"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={reload}
            className="mt-3 text-sm font-semibold underline"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🔔
          </div>

          <h2 className="text-lg font-bold text-slate-800">
            {filter === "unread"
              ? "You are all caught up"
              : "No notifications yet"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            You will be notified when someone claims your item or your
            claim is reviewed.
          </p>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <ul className="space-y-3">
          {visible.map((notification) => {
            const meta = TYPE_META[notification.type] || DEFAULT_META;
            const unread = !isNotificationRead(notification);
            const decision = decisions[notification.claimId];
            const canReview =
              notification.type === "CLAIM_SUBMITTED" &&
              notification.claimId !== undefined &&
              notification.claimId !== null;
            const isConfirming = confirming?.id === notification.id;
            const isProcessing = processingId === notification.id;

            return (
              <li
                key={notification.id}
                className={`animate-fade-up rounded-xl border p-4 shadow-sm transition ${
                  unread
                    ? "border-blue-200 bg-blue-50/50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${meta.circle}`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d={meta.path} />
                    </svg>
                  </span>

                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => openNotification(notification)}
                      className="block w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-bold text-slate-900">
                          {notification.title || meta.label}
                        </p>

                        <span className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                          {unread && (
                            <span
                              className="h-2.5 w-2.5 rounded-full bg-blue-600"
                              aria-label="Unread"
                            />
                          )}
                          {timeAgo(notification.createdAt)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {notification.message}
                      </p>
                    </button>

                    {/* Reporter review actions (only claims can be reviewed) */}
                    {canReview && decision && (
                      <p
                        className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                          decision === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        You {decision === "APPROVED" ? "approved" : "rejected"}{" "}
                        this claim
                      </p>
                    )}

                    {canReview && !decision && !isConfirming && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setConfirming({
                              id: notification.id,
                              action: "approve",
                            })
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setConfirming({
                              id: notification.id,
                              action: "reject",
                            })
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {canReview && !decision && isConfirming && (
                      <div
                        role="alertdialog"
                        aria-label="Confirm decision"
                        className={`animate-pop mt-3 rounded-lg border p-3 ${
                          confirming.action === "approve"
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {confirming.action === "approve"
                            ? "Approve this claim?"
                            : "Reject this claim?"}{" "}
                          <span className="font-normal text-slate-500">
                            The claimant will be notified.
                          </span>
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() =>
                              decide(notification, confirming.action)
                            }
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              confirming.action === "approve"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {isProcessing
                              ? "Processing..."
                              : confirming.action === "approve"
                                ? "Yes, approve"
                                : "Yes, reject"}
                          </button>

                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => setConfirming(null)}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                      {notification.itemId && (
                        <Link
                          to={`/items/${notification.itemId}`}
                          onClick={() => markRead(notification)}
                          className="text-blue-600 hover:underline"
                        >
                          View item →
                        </Link>
                      )}

                      {(notification.type === "CLAIM_APPROVED" ||
                        notification.type === "CLAIM_REJECTED") && (
                        <Link
                          to="/track-claim"
                          onClick={() => markRead(notification)}
                          className="text-blue-600 hover:underline"
                        >
                          Track my claims →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
