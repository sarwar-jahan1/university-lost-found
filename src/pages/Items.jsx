
import { useMemo, useState } from "react";
import ItemCard from "../components/ItemCard";
import demoItems from "../data/items";

const Items = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(demoItems.map((item) => item.category)),
  ];

  const normalize = (value) =>
    String(value ?? "").toLowerCase().trim();

  const filteredItems = useMemo(() => {
    const searchTerms = normalize(search)
      .split(/\s+/)
      .filter(Boolean);

    return demoItems.filter((item) => {
      const searchableText = normalize([
        item.id,
        item.name,
        item.category,
        item.status,
        item.location,
        item.description,
        item.date,
      ].join(" "));

      const matchesSearch = searchTerms.every((term) =>
        searchableText.includes(term)
      );

      const matchesStatus =
        status === "All" || item.status === status;

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [search, status, category]);

  const clearFilters = () => {
    setSearch("");
    setStatus("All");
    setCategory("All");
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Browse Items
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Search and find lost or found items on your campus.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, category, location..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Lost">Lost Items</option>
              <option value="Found">Found Items</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              {categories.map((itemCategory) => (
                <option key={itemCategory} value={itemCategory}>
                  {itemCategory === "All"
                    ? "All Categories"
                    : itemCategory}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredItems.length}
              </span>{" "}
              of {demoItems.length} items
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-16 text-center">
            <h2 className="text-xl font-bold text-slate-800">
              No Items Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No matching items found. Try another keyword or filter.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default Items;
