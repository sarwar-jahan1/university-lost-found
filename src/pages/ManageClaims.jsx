
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getItemClaims,
  approveClaim,
  rejectClaim,
} from "../services/claimService";

const normalizeClaims = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.claims)) return data.claims;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const ManageClaims = () => {
  const { itemId } = useParams();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [processingId, setProcessingId] = useState(null);

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
          String(claim.id) === String(claimId)
            ? { ...claim, status: newStatus }
            : claim
        )
      );
    } catch (err) {
      setActionError(
        err.message || `Unable to ${action} this claim.`
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Claim Management
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          Manage Incoming Claims
        </h1>

        <p className="mt-2 text-slate-600">
          Review claims submitted for your reported item.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl bg-slate-50 p-6 text-slate-600">
          Loading incoming claims...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && actionError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {actionError}
        </div>
      )}

      {!loading && !error && claims.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
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

            const isProcessing = processingId === claim.id;

            return (
              <article
                key={claim.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">
                    Claim #{claim.id}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      statusStyles[status] ||
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                {claim.claimantName && (
                  <p className="mb-2 text-sm text-slate-600">
                    Claimant: {claim.claimantName}
                  </p>
                )}

                {claim.claimantEmail && (
                  <p className="mb-2 text-sm text-slate-600">
                    Email: {claim.claimantEmail}
                  </p>
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

                {status === "PENDING" && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleClaimAction(claim.id, "approve")
                      }
                      className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? "Processing..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleClaimAction(claim.id, "reject")
                      }
                      className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? "Processing..." : "Reject"}
                    </button>
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
