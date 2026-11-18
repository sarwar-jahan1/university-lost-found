// Small helpers so claim pages keep working whichever shape the backend
// uses for a claim (flat `itemId` or a nested `item` object, etc.).

export const getClaimItemId = (claim) =>
  claim?.itemId ?? claim?.item?.id ?? claim?.item_id;

export const getClaimItemTitle = (claim) =>
  claim?.itemTitle ?? claim?.item?.title ?? claim?.item?.name ?? "";

export const getClaimant = (claim) => {
  const nested =
    claim?.claimant || claim?.user || claim?.claimedBy || claim?.requester;

  const object = nested && typeof nested === "object" ? nested : {};
  const nestedText = typeof nested === "string" ? nested : "";

  return {
    name:
      claim?.claimantName ||
      object.name ||
      object.fullName ||
      (nestedText && !nestedText.includes("@") ? nestedText : ""),
    email:
      claim?.claimantEmail ||
      object.email ||
      (nestedText.includes("@") ? nestedText : ""),
  };
};

// The API leaves a rejected claim as PENDING, but it does send a
// CLAIM_REJECTED / CLAIM_APPROVED notification carrying the claim id.
// Use those notifications to show the real decision on the claim.
export const applyNotificationDecisions = (claims, notifications = []) => {
  const decisions = {};

  notifications.forEach((notification) => {
    if (notification?.claimId === undefined || notification?.claimId === null) {
      return;
    }

    if (notification.type === "CLAIM_REJECTED") {
      decisions[String(notification.claimId)] = "REJECTED";
    } else if (notification.type === "CLAIM_APPROVED") {
      decisions[String(notification.claimId)] = "APPROVED";
    }
  });

  return claims.map((claim) => {
    const current = String(claim.status || "PENDING").toUpperCase();
    const decided = decisions[String(claim.id)];

    return current === "PENDING" && decided
      ? { ...claim, status: decided }
      : claim;
  });
};
