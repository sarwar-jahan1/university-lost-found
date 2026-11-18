import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import ClaimForm from "../components/ClaimForm";
import StatusBadge from "../components/ui/StatusBadge";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/toastContext";
import {
  ArrowIcon,
  CalendarIcon,
  PinIcon,
  ShareIcon,
} from "../components/ui/Icons";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getCurrentUser } from "../services/authService";

const OWNER_KEYS = [
  "userId",
  "reporterId",
  "ownerId",
  "createdBy",
  "reportedBy",
  "user",
  "reporter",
  "owner",
  "userEmail",
  "reporterEmail",
  "ownerEmail",
  "createdByEmail",
];

// Works out whether the signed-in user reported this item, based on
// whichever owner field the API happens to return.
//   true  = the signed-in user reported it
//   false = the item clearly belongs to someone else
//   null  = we cannot tell (no owner info, or nothing we can compare with
//           the signed-in user), so the page keeps both options reachable
const checkOwnership = (item, user) => {
  if (!user) return null;

  const userId = user.id ?? user.userId;
  const userEmail = user.email ? String(user.email).toLowerCase() : null;

  let comparable = false;

  for (const key of OWNER_KEYS) {
    const value = item[key];
    if (value === undefined || value === null) continue;

    const candidates =
      typeof value === "object"
        ? [value.id, value.userId, value.email]
        : [value];

    for (const candidate of candidates) {
      if (candidate === undefined || candidate === null) continue;

      const text = String(candidate);

      if (text.includes("@")) {
        if (!userEmail) continue;
        comparable = true;
        if (text.toLowerCase() === userEmail) return true;
      } else {
        if (userId === undefined || userId === null) continue;
        comparable = true;
        if (text === String(userId)) return true;
      }
    }
  }

  return comparable ? false : null;
};

const ItemDetails = () => {
  const { id } = useParams();
  const { notify } = useToast();

  const [item, setItem] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useDocumentTitle(item?.title || item?.name || "Item Details");

  useEffect(() => {
    let active = true;

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/api/items/${id}/`);
        const itemData = data?.item || data;

        if (!itemData || !itemData.id) {
          throw new Error("Item not found.");
        }

        if (active) {
          setItem(itemData);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load item.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      active = false;
    };
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item?.title || item?.name || "Lost & Found item",
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      notify("Link copied to clipboard.", "success");
    } catch (err) {
      // User dismissing the share sheet is not an error
      if (err?.name !== "AbortError") {
        notify("Could not copy the link.", "error");
      }
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-8">
        <div
          className="mx-auto max-w-3xl"
          aria-busy="true"
          aria-label="Loading item"
        >
          <Skeleton className="mb-5 h-4 w-40" />

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <Skeleton className="h-6 w-20 !rounded-full" />
            <Skeleton className="mt-6 h-8 w-3/4" />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>

            <Skeleton className="mt-8 h-5 w-40" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-8 h-12 w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
          🔍
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Item Not Found
        </h1>

        <p className="mt-3 text-slate-500">
          {error || "The requested item does not exist."}
        </p>

        <Link
          to="/items"
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Items
        </Link>
      </div>
    );
  }

  const status =
    item.type === "LOST"
      ? "Lost"
      : item.type === "FOUND"
        ? "Found"
        : item.status || item.type;

  const eventDate = item.eventDate
    ? new Date(`${item.eventDate}T00:00:00`).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Date unavailable";

  // true = reporter, false = someone else, null = API sends no owner info
  const isOwner = checkOwnership(item, getCurrentUser());

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-2 text-sm"
        >
          <Link
            to="/items"
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to Items
          </Link>
        </nav>

        <div className="animate-fade-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            className={`h-1.5 ${
              status === "Lost" ? "bg-red-400" : "bg-emerald-400"
            }`}
          />

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <StatusBadge status={status} className="!px-4 !py-1.5 !text-sm" />

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <ShareIcon />
                Share
              </button>
            </div>

            <h1 className="mt-5 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
              {item.title || item.name || "Untitled Item"}
            </h1>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <PinIcon className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Location
                  </p>
                  <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">
                    {item.location || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <CalendarIcon className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">
                    {eventDate}
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-7 border-slate-200" />

            <h2 className="text-lg font-bold text-slate-900">
              Item Description
            </h2>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {item.description || "No description available."}
            </p>

            {isOwner ? (
              <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                <p className="mb-3 text-sm text-slate-600 sm:mb-0">
                  You reported this item. Review the claims other
                  students have submitted for it.
                </p>

                <Link
                  to={`/manage-claims/${item.id}`}
                  className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 sm:w-auto"
                >
                  Manage Claims
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50/60 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                  <p className="mb-3 text-sm text-slate-600 sm:mb-0">
                    Think this is yours? Submit a claim and we will
                    let the reporter review it.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowClaimForm(true)}
                    className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
                  >
                    Claim This Item
                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Always keep claims reachable for the reporter, even if the
                    owner could not be detected. The backend still decides
                    who may actually see or decide on the claims. */}
                <p className="mt-4 text-center text-sm text-slate-500">
                  Did you report this item?{" "}
                  <Link
                    to={`/manage-claims/${item.id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Manage its claims
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        {showClaimForm && (
          <ClaimForm
            itemId={item.id}
            onClose={() => setShowClaimForm(false)}
          />
        )}
      </div>
    </section>
  );
};

export default ItemDetails;
