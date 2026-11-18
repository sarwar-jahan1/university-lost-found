
import { Link } from "react-router-dom";
import StatusBadge from "./ui/StatusBadge";
import { ArrowIcon, CalendarIcon, PinIcon } from "./ui/Icons";

const DAY = 24 * 60 * 60 * 1000;

const relativeDate = (eventDate) => {
  if (!eventDate) return "";

  const parsed = new Date(`${eventDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";

  const days = Math.round((Date.now() - parsed.getTime()) / DAY);

  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} wk ago`;
  return "";
};

const ItemCard = ({ item }) => {
  const status =
    item.type?.toUpperCase() === "LOST" ||
    item.status?.toUpperCase() === "LOST"
      ? "Lost"
      : "Found";

  const eventDate = item.eventDate || item.date;
  const relative = relativeDate(eventDate);
  const isLost = status === "Lost";

  return (
    <article className="animate-fade-up group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div
        className={`h-1 w-full ${isLost ? "bg-red-400" : "bg-emerald-400"}`}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <StatusBadge status={status} />

          {relative && (
            <span className="text-xs font-medium text-slate-400">
              {relative}
            </span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-blue-700">
          {item.title || item.name}
        </h3>

        <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-5 text-slate-600">
          {item.description || "No description available."}
        </p>

        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <PinIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate">
            {item.location || "Location unavailable"}
          </span>
        </div>

        <div className="mb-5 flex items-center gap-2 text-sm text-slate-500">
          <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" />
          <span>
            {eventDate
              ? new Date(`${eventDate}T00:00:00`).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )
              : "Date unavailable"}
          </span>
        </div>

        <div className="mt-auto">
          <Link
            to={`/items/${item.id}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2.5 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white after:absolute after:inset-0 after:content-['']"
          >
            View Details
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
