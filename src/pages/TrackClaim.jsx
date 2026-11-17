
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const normalizeClaims = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.claims)) return data.claims;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const TrackClaim = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await apiRequest("/api/claims/");
        setClaims(normalizeClaims(data));
      } catch (err) {
        setError(err.message || "Unable to load your claims.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Track My Claims
      </h1>

      <p className="mb-8 text-slate-600">
        View the status of claims you have submitted.
      </p>

      {loading && (
        <p className="rounded-lg bg-slate-50 p-5 text-slate-600">
          Loading your claims...
        </p>
      )}

      {!loading && error && (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && claims.length === 0 && (
        <p className="rounded-lg bg-slate-50 p-5 text-slate-600">
          You have not submitted any claims yet.
        </p>
      )}

      {!loading && !error && claims.length > 0 && (
        <div className="space-y-4">
          {claims.map((claim) => {
            const status = String(claim.status || "PENDING").toUpperCase();

            return (
              <article
                key={claim.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
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

                {claim.itemId !== undefined && (
                  <p className="mb-2 text-sm text-slate-600">
                    Item ID: {claim.itemId}
                  </p>
                )}

                {claim.description && (
                  <p className="text-sm leading-6 text-slate-600">
                    {claim.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackClaim;
