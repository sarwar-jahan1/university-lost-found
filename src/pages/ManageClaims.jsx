
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getItemClaims,
  approveClaim,
  rejectClaim,
} from "../services/claimService";
import StatusBadge from "../components/ui/StatusBadge";
import { ListRowSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/toastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getClaimant } from "../utils/claims";

const normalizeClaims = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.claims)) return data.claims;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

// A claim is only "decided" once it is approved or rejected. Any other
// status word the backend uses (PENDING, OPEN, SUBMITTED ...) can still be
// approved or rejected, so the buttons must not depend on one exact word.
const FINAL_STATUSES = [
  "APPROVED",
  "ACCEPTED",
  "REJECTED",
  "DECLINED",
  "DENIED",
];

const getClaimId = (claim) => claim.id ?? claim.claimId ?? claim._id;

const ManageClaims = () => {
  useDocumentTitle("Manage Claims");

  const { itemId } = useParams();
  const { notify } = useToast();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  // { id, action } of the claim awaiting confirmation
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getItemClaims(itemId);
        setClaims(normalizeClaims(data));
      } catch (err) {
        setError(err.message || "Unable to load incoming claims.");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchClaims();
    } else {
      setError("Item ID is missing.");
      setLoading(false);
    }
  }, [itemId]);

  const handleClaimAction = async (claimId, action) => {
    try {
      setProcessingId(claimId);
      setActionError("");

      if (action === "approve") {
        await approveClaim(claimId);
      } else {
        await rejectClaim(claimId);
      }

      const newStatus =
        action === "approve" ? "APPROVED" : "REJECTED";

      setClaims((previousClaims) =>
        previousClaims.map((claim) =>
          String(getClaimId(claim)) === String(claimId)
            ? { ...claim, status: newStatus }
            : claim
        )
      );

      // Re-sync with the server: it may have changed other claims too
      // (for example auto-rejecting the rest after an approval).
      try {
        const fresh = await getItemClaims(itemId);
        setClaims(normalizeClaims(fresh));
      } catch {
        // keep the locally updated list if the refresh fails
      }

      notify(
        `Claim #${claimId} ${
          action === "approve" ? "approved" : "rejected"
        }.`,
        "success"
      );
    } catch (err) {
      const message = err.message || `Unable to ${action} this claim.`;
      setActionError(message);
      notify(message, "error");
    } finally {
      setProcessingId(null);
      setConfirming(null);
    }
  };

  const hasApproved = claims.some(
    (claim) => String(claim.status || "").toUpperCase() === "APPROVED"
  );

  const pendingCount = claims.filter(
    (claim) =>
      !FINAL_STATUSES.includes(
        String(claim.status || "PENDING").toUpperCase()
      )
  ).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        to={`/items/${itemId}`}
        className="mb-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
      >
        ← Back to item
      </Link>

      <div className="animate-fade-up mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Claim Management
          </p>

          <h1 className="text-3xl font-extrabold text-slate-900">
            Manage Incoming Claims
          </h1>

          <p className="mt-2 text-slate-600">
            Review claims submitted for your reported item.
          </p>
        </div>

        {!loading && !error && claims.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
            {pendingCount} pending of {claims.length}
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-4" aria-busy="true" aria-label="Loading claims">
          <ListRowSkeleton />
          <ListRowSkeleton />
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"
        >
          {error}
        </div>
      )}

      {!loading && !error && actionError && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {actionError}
        </div>
      )}

      {!loading && !error && claims.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            📭
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            No claims yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No one has submitted a claim for this item yet.
          </p>
        </div>
      )}

      {!loading && !error && claims.length > 0 && (
        <div className="space-y-5">
          {claims.map((claim) => {
            const status = String(
              claim.status || "PENDING"
            ).toUpperCase();

            const claimant = getClaimant(claim);
            const claimId = getClaimId(claim);
            const canDecide = !FINAL_STATUSES.includes(status);
            const isProcessing = processingId === claimId;
            const isConfirming = confirming?.id === claimId;
            const confirmAction = confirming?.action;

            return (
              <article
                key={claimId}
                className="animate-fade-up rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">
                    Claim #{claimId}
                  </h2>

                  <StatusBadge status={status} />
                </div>

                {(claimant.name || claimant.email) && (
                  <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {(claimant.name || claimant.email)
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 text-sm">
                      {claimant.name && (
                        <p className="font-semibold text-slate-800">
                          Claimant: {claimant.name}
                        </p>
                      )}

                      {claimant.email && (
                        <p className="truncate text-slate-500">
                          Email: {claimant.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {claim.description && (
                  <p className="mb-2 text-sm leading-6 text-slate-600">
                    {claim.description}
                  </p>
                )}

                {!claim.description && claim.message && (
                  <p className="mb-2 text-sm leading-6 text-slate-600">
                    {claim.message}
                  </p>
                )}

                {canDecide && !isConfirming && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={isProcessing || hasApproved}
                      title={
                        hasApproved
                          ? "Another claim was already approved for this item."
                          : undefined
                      }
                      onClick={() =>
                        setConfirming({ id: claimId, action: "approve" })
                      }
                      className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        setConfirming({ id: claimId, action: "reject" })
                      }
                      className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {canDecide && isConfirming && (
                  <div
                    role="alertdialog"
                    aria-label="Confirm decision"
                    className={`animate-pop mt-5 rounded-lg border p-4 ${
                      confirmAction === "approve"
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {confirmAction === "approve"
                        ? "Approve this claim? The claimant will be recognised as the owner."
                        : "Reject this claim?"}{" "}
                      <span className="font-normal text-slate-500">
                        This decision can&apos;t be undone from this
                        page.
                      </span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handleClaimAction(claimId, confirmAction)
                        }
                        className={`rounded-lg px-5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          confirmAction === "approve"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {isProcessing
                          ? "Processing..."
                          : confirmAction === "approve"
                            ? "Yes, approve"
                            : "Yes, reject"}
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setConfirming(null)}
                        className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageClaims;
