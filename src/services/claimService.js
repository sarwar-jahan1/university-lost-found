
import { apiRequest } from "./api";

// Get claims submitted for a specific item
export const getItemClaims = async (itemId) => {
  if (!itemId) {
    throw new Error("Item ID is required.");
  }

  return apiRequest(`/api/items/${itemId}/claims/`);
};

// Approve a claim
export const approveClaim = async (claimId) => {
  if (!claimId) {
    throw new Error("Claim ID is required.");
  }

  return apiRequest(`/api/claims/${claimId}/approve/`, {
    method: "POST",
  });
};

// Reject a claim
export const rejectClaim = async (claimId) => {
  if (!claimId) {
    throw new Error("Claim ID is required.");
  }

  return apiRequest(`/api/claims/${claimId}/reject/`, {
    method: "POST",
  });
};
