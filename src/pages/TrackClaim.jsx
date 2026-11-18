
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import StatusBadge from "../components/ui/StatusBadge";
import { ListRowSkeleton } from "../components/ui/Skeleton";
import { ArrowIcon } from "../components/ui/Icons";
import useDocumentTitle from "../hooks/useDocumentTitle";
import ItemImage from "../components/ui/ItemImage";
import {
  applyNotificationDecisions,
  getClaimItemId,
  getClaimItemTitle,
} from "../utils/claims";
import { getNotifications } from "../services/notificationService";

const normalizeClaims = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.claims)) return data.claims;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const statusHints = {
  PENDING: "Waiting for the reporter to review your claim.",
  APPROVED: "Your claim was approved. Contact the reporter to collect the item.",
  REJECTED: "This claim was not approved.",
};

const accent = {
  PENDING: "border-l-amber-400",
  APPROVED: "border-l-emerald-500",
  REJECTED: "border-l-red-400",
};

const TrackClaim = () => {
  useDocumentTitle("Track Claims");

  const [claims, setClaims] = useState([]);
  // Claims only carry an item id, so look the items up for title + photo
  const [itemsById, setItemsById] = useState({});
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let active = true;

    const fetchClaims = async () => {
      try {
        const [claimsResult, itemsResult, notificationsResult] =
          await Promise.allSettled([
            apiRequest("/api/claims/"),
            apiRequest("/api/items/"),
            getNotifications(),
          ]);

        if (!active) return;

        if (claimsResult.status === "fulfilled") {
          setClaims(
            applyNotificationDecisions(
              normalizeClaims(claimsResult.value),
              notificationsResult.status === "fulfilled"
                ? notificationsResult.value
                : []
            )
          );
        } else {
          setError(
            claimsResult.reason?.message || "Unable to load your claims."
          );
        }

        if (itemsResult.status === "fulfilled") {
          const map = {};
          normalizeClaims(itemsResult.value).forEach((item) => {
            map[String(item.id)] = item;
          });
          setItemsById(map);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchClaims();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const getStatus = (claim) =>
    String(claim.status || "PENDING").toUpperCase();

  const counts = useMemo(() => {
    const result = { ALL: claims.length, PENDING: 0, APPROVED: 0, REJECTED: 0 };

    claims.forEach((claim) => {
      const key = getStatus(claim);
      if (key in result) result[key] += 1;
    });

    return result;
  }, [claims]);

  const visibleClaims = claims.filter(
    (claim) => filter === "ALL" || getStatus(claim) === filter
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="animate-fade-up mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold text-slate-900">
            Track My Claims
          </h1>

          <p className="text-slate-600">
            View the status of claims you have submitted.
          </p>
        </div>

        {!loading && !error && (
          <button
            type="button"
            onClick={reload}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-700"
          >
            ↻ Refresh
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-4" aria-busy="true" aria-label="Loading claims">
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

      {!loading && !error && claims.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            📝
          </div>

          <h2 className="text-lg font-bold text-slate-800">
            You have not submitted any claims yet.
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Find an item that belongs to you and submit a claim.
          </p>

          <Link
            to="/items"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Items
            <ArrowIcon />
          </Link>
        </div>
      )}

      {!loading && !error && claims.length > 0 && (
        <>
          {/* Summary + filter tabs */}
          <div
            role="group"
            aria-label="Filter claims by status"
            className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {FILTERS.map((key) => {
              const active = filter === key;

              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(key)}
                  className={`rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                  }`}
                >
                  <p className="text-2xl font-extrabold">{counts[key]}</p>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      active ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {key === "ALL" ? "All Claims" : key.toLowerCase()}
                  </p>
                </button>
              );
            })}
          </div>

          {visibleClaims.length === 0 ? (
            <p className="rounded-xl bg-white p-8 text-center text-sm text-slate-500">
              No {filter.toLowerCase()} claims.
            </p>
          ) : (
            <div className="space-y-4">
              {visibleClaims.map((claim) => {
                const status = getStatus(claim);
                const itemId = getClaimItemId(claim);
                const linkedItem = itemsById[String(itemId)];
                const itemTitle =
                  getClaimItemTitle(claim) || linkedItem?.title || "";

                return (
                  <article
                    key={claim.id}
                    className={`animate-fade-up rounded-xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md ${
                      accent[status] || "border-l-slate-300"
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-lg font-bold text-slate-900">
                        Claim #{claim.id}
                      </h2>

                      <StatusBadge status={status} />
                    </div>

                    {claim.createdAt && (
                      <p className="-mt-1 mb-3 text-xs text-slate-400">
                        Submitted{" "}
                        {new Date(claim.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </p>
                    )}

                    {itemId !== undefined && itemId !== null && (
                      <Link
                        to={`/items/${itemId}`}
                        className="group mb-3 flex items-center gap-3 rounded-lg border border-slate-200 p-2 transition hover:border-blue-300 hover:bg-blue-50/40"
                      >
                        <ItemImage
                          item={linkedItem || {}}
                          className="h-14 w-14 shrink-0 rounded-md"
                        />

                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">Item</p>
                          <p className="truncate text-sm font-semibold text-blue-700 group-hover:underline">
                            {itemTitle || `#${itemId}`}
                          </p>
                        </div>
                      </Link>
                    )}

                    {claim.description && (
                      <p className="rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                        {claim.description}
                      </p>
                    )}

                    {statusHints[status] && (
                      <p className="mt-3 text-xs text-slate-400">
                        {statusHints[status]}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrackClaim;
