
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  const status =
    item.type?.toUpperCase() === "LOST" ||
    item.status?.toUpperCase() === "LOST"
      ? "Lost"
      : "Found";

  const eventDate = item.eventDate || item.date;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              status === "Lost"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status}
          </span>
        </div>

        <h3 className="mb-3 line-clamp-1 text-base font-bold text-slate-900">
          {item.title || item.name}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm text-slate-600">
          {item.description}
        </p>

        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <span>📍</span>
          <span className="truncate">{item.location}</span>
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <span>📅</span>
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
            className="block rounded-lg border border-blue-200 px-3 py-2.5 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
          >
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ItemCard;
