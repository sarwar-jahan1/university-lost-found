const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const PinIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} {...base}>
    <path d="M20 11c0 5-8 10-8 10S4 16 4 11a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="11" r="2.5" />
  </svg>
);

export const CalendarIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} {...base}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const SearchIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} {...base}>
    <circle cx="11" cy="11" r="7" />
    <path d="m16 16 4 4" />
  </svg>
);

export const ArrowIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} {...base}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

export const CopyIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} {...base}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);

export const CheckIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} {...base}>
    <path d="m5 12 5 5 9-10" />
  </svg>
);

export const EyeIcon = ({ off = false, className = "h-5 w-5" }) => (
  <svg className={className} {...base}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="m4 4 16 16" />}
  </svg>
);

export const ShareIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} {...base}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);
