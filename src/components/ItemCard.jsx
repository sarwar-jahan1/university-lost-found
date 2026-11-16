
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Image */}
      <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
            item.status === "Lost"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">

        <p className="mb-2 text-xs font-semibold text-blue-600">
          {item.category}
        </p>

        <h3 className="mb-3 line-clamp-1 text-base font-bold text-slate-900">
          {item.name}
        </h3>

        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <span>📍</span>
          <span className="truncate">{item.location}</span>
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <span>📅</span>
          <span>
            {new Date(item.date + "T00:00:00").toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
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
