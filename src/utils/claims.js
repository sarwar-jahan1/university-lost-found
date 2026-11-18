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
