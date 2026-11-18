const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// The API returns `imageUrl` for an item (null when no photo was uploaded).
// Absolute URLs are used as-is; relative paths are resolved against the API.
export const getImageUrl = (item) => {
  const raw = item?.imageUrl ?? item?.image_url ?? item?.image;

  if (!raw || typeof raw !== "string") return "";

  if (/^(https?:)?\/\//i.test(raw) || /^(data|blob):/i.test(raw)) {
    return raw;
  }

  return `${API_BASE_URL.replace(/\/+$/, "")}/${raw.replace(/^\/+/, "")}`;
};

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // backend limit: 5 MB

// Returns an error message, or "" when the file can be uploaded.
export const validateImageFile = (file) => {
  if (!file) return "";

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Photo must be a JPG, PNG or WEBP image.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "Photo must be 5 MB or smaller.";
  }

  return "";
};
