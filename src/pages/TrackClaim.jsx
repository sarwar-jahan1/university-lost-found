import { useState } from "react";

// Sample claims until the project's claim API is available.
const claims = [
    { claimCode: "CLM-1001", status: "Pending" },
    { claimCode: "CLM-1002", status: "Approved" },
    { claimCode: "CLM-1003", status: "Rejected" },
    { claimCode: "CLM-1004", status: "Returned" },
];

const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Returned: "bg-blue-100 text-blue-800",
};

const TrackClaim = () => {
    const [claimCode, setClaimCode] = useState("");
    const [claim, setClaim] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = (event) => {
        event.preventDefault();
        setClaim(null);
        setError("");

        const code = claimCode.trim().toUpperCase();

        if (!code) {
            setError("Please enter your Claim Code.");
            return;
        }

        const matchedClaim = claims.find(
            (item) => item.claimCode === code
        );

        if (!matchedClaim) {
            setError("No claim found. Please check your Claim Code and try again.");
            return;
        }

        setClaim(matchedClaim);
    };

    return (
        <div className="mx-auto max-w-xl px-4 py-12">
            <h1 className="mb-2 text-3xl font-bold">Track Claim</h1>
            <p className="mb-6 text-gray-600">
                Enter your Claim Code to check its current status.
            </p>

            <form onSubmit={handleSearch} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="claimCode" className="mb-2 block font-medium">
                        Claim Code
                    </label>
                    <input
                        id="claimCode"
                        type="text"
                        value={claimCode}
                        onChange={(event) => {
                            setClaimCode(event.target.value);
                            setClaim(null);
                            setError("");
                        }}
                        placeholder="e.g. CLM-1001"
                        required
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "claim-error" : undefined}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Search
                </button>
            </form>

            <div aria-live="polite" aria-atomic="true">
                {error && (
                    <p id="claim-error" className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
                        {error}
                    </p>
                )}

                {claim && (
                    <div className="mt-6 rounded-lg border border-gray-200 p-5">
                        <h2 className="mb-3 text-xl font-semibold">Claim Details</h2>
                        <p className="mb-3">Claim Code: {claim.claimCode}</p>
                        <p>
                            Current Status: {" "}
                            <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[claim.status]}`}>
                                {claim.status}
                            </span>
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-8 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                <p className="mb-2 font-medium">Demo Claim Codes (sample data)</p>
                <p>CLM-1001: Pending · CLM-1002: Approved</p>
                <p>CLM-1003: Rejected · CLM-1004: Returned</p>
            </div>
        </div>
    );
};

export default TrackClaim;
