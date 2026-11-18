
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import { ItemCardSkeleton } from "../components/ui/Skeleton";
import { SearchIcon } from "../components/ui/Icons";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { apiRequest } from "../services/api";

const normalizeItem = (item) => {
  const itemType = String(item.type || item.status || "").toUpperCase();

  return {
    ...item,
    id: item.id,
    name: item.title || item.name || "Untitled Item",
    status:
      itemType === "LOST"
        ? "Lost"
        : itemType === "FOUND"
          ? "Found"
          : item.status || "Unknown",
    date: item.eventDate || item.date || "",
  };
};

const normalizeItemList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const normalizeText = (value) =>
  String(value ?? "").toLowerCase().trim();

const SORT_OPTIONS = [
  { value: "default", label: "Default order" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name", label: "Name A–Z" },
];

const STATUS_TABS = ["All", "Lost", "Found"];

const Items = () => {
  useDocumentTitle("Browse Items");

  const searchRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters live in the URL so results can be shared / restored on Back
  const search = searchParams.get("q") || "";
  const statusParam = searchParams.get("status") || "All";
  const status = STATUS_TABS.includes(statusParam) ? statusParam : "All";
  const sortParam = searchParams.get("sort") || "default";
  const sort = SORT_OPTIONS.some((option) => option.value === sortParam)
    ? sortParam
    : "default";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const updateParam = (key, value, fallback) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);

        if (!value || value === fallback) {
          next.delete(key);
        } else {
          next.set(key, value);
        }

        return next;
      },
      { replace: true }
    );
  };

  const setSearch = (value) => updateParam("q", value, "");
  const setStatus = (value) => updateParam("status", value, "All");
  const setSort = (value) => updateParam("sort", value, "default");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/api/items/");
      const itemList = normalizeItemList(data);

      setItems(itemList.map(normalizeItem));
    } catch (err) {
      setError(err.message || "Failed to load items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Press "/" anywhere to jump to search
  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = event.target?.tagName;
      if (
        event.key === "/" &&
        tag !== "INPUT" &&
        tag !== "TEXTAREA" &&
        tag !== "SELECT"
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const statusCounts = useMemo(
    () => ({
      All: items.length,
      Lost: items.filter((item) => item.status === "Lost").length,
      Found: items.filter((item) => item.status === "Found").length,
    }),
    [items]
  );

  const filteredItems = useMemo(() => {
    const searchTerms = normalizeText(search)
      .split(/\s+/)
      .filter(Boolean);

    const result = items.filter((item) => {
      const searchableText = normalizeText(
        [
          item.id,
          item.name,
          item.status,
          item.location,
          item.description,
          item.date,
        ].join(" ")
      );

      const matchesSearch = searchTerms.every((term) =>
        searchableText.includes(term)
      );

      const matchesStatus =
        status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });

    if (sort === "newest") {
      return [...result].sort(
        (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
      );
    }

    if (sort === "oldest") {
      return [...result].sort(
        (a, b) => new Date(a.date || 0) - new Date(b.date || 0)
      );
    }

    if (sort === "name") {
      return [...result].sort((a, b) =>
        String(a.name).localeCompare(String(b.name))
      );
    }

    return result;
  }, [items, search, status, sort]);

  const hasActiveFilters =
    search.trim() !== "" || status !== "All" || sort !== "default";

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    searchRef.current?.focus();
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="animate-fade-up mb-7 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Campus Lost & Found
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Browse Items
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Search and find lost or found items on your campus.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="sticky top-[68px] z-30 lg:top-4 mb-8 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">

            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID or location...  (press / to focus)"
                aria-label="Search items"
                className="w-full rounded-lg border border-slate-300 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 [&::-webkit-search-cancel-button]:hidden"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort items"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 md:w-48"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

          </div>

          {/* Status chips */}
          <div
            role="group"
            aria-label="Filter by item status"
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            {STATUS_TABS.map((tab) => {
              const active = status === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatus(tab)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700"
                  }`}
                >
                  {tab === "All" ? "All Items" : `${tab} Items`}

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {statusCounts[tab]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500" aria-live="polite">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredItems.length}
              </span>{" "}
              of {items.length} items
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-busy="true"
            aria-label="Loading items"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <ItemCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-12 text-center text-red-600"
          >
            <p className="font-semibold">{error}</p>

            <button
              type="button"
              onClick={fetchItems}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Items */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="animate-fade-up rounded-xl border border-dashed border-slate-300 bg-white px-4 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <SearchIcon className="h-7 w-7" />
            </div>

            <h2 className="text-xl font-bold text-slate-800">
              No Items Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No matching items found. Try another keyword or filter.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default Items;
