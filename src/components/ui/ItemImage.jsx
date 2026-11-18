import { useState } from "react";
import { getImageUrl } from "../../utils/items";

// Item photo with a graceful placeholder when there is no image
// or when the image fails to load.
const ItemImage = ({ item, className = "", zoom = true }) => {
  const src = getImageUrl(item);
  const [failedSrc, setFailedSrc] = useState("");

  const isLost =
    String(item?.type || item?.status || "").toUpperCase() === "LOST";

  if (!src || failedSrc === src) {
    return (
      <div
        className={`flex items-center justify-center ${
          isLost
            ? "bg-gradient-to-br from-red-50 to-rose-100 text-red-300"
            : "bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-300"
        } ${className}`}
        role="img"
        aria-label="No photo available"
      >
        <svg
          className="h-1/3 w-1/3 max-h-12 max-w-12 min-h-5 min-w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.8" />
          <path d="m21 16-5-5-8 8" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={src}
        alt={item?.title || item?.name || "Item photo"}
        loading="lazy"
        onError={() => setFailedSrc(src)}
        className={`h-full w-full object-cover ${
          zoom
            ? "transition-transform duration-500 group-hover:scale-105"
            : ""
        }`}
      />
    </div>
  );
};

export default ItemImage;
