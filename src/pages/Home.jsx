
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const normalizeItem = (item) => ({
  ...item,
  id: item.id,
  name: item.title || item.name || "Untitled Item",
  status:
    item.type === "LOST"
      ? "Lost"
      : item.type === "FOUND"
        ? "Found"
        : item.status || item.type,
  date: item.eventDate || item.date,
  category: item.category || "Other",
});

const steps = [
  {
    number: "01",
    title: "Report an Item",
    description:
      "Report a lost or found item by providing its details and location.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5v14m-7-7h14"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Search Items",
    description:
      "Browse reported items and find something that belongs to you.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
        <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Submit a Claim",
    description:
      "Submit a claim for an item and follow its claim status.",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5 2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
        />
      </svg>
    ),
  },
];

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemsError, setItemsError] = useState("");

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setLoadingItems(true);
        setItemsError("");

        const data = await apiRequest("/api/items/");

        const itemList = Array.isArray(data)
          ? data
          : data?.content || data?.items || [];

        const normalizedItems = itemList
          .map(normalizeItem)
          .sort(
            (a, b) =>
              new Date(b.date || 0) - new Date(a.date || 0)
          );

        setRecentItems(normalizedItems.slice(0, 4));
      } catch (error) {
        setItemsError(
          error.message || "Failed to load recent items."
        );
      } finally {
        setLoadingItems(false);
      }
    };

    fetchRecentItems();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-28 lg:px-10">

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Campus Lost & Found Community
            </span>

            <h1 className="mt-7 max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Lost Something?
              <span className="mt-2 block text-blue-300">
                Let's Find It Together.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-blue-100/80 sm:text-lg">
              Lost or found something on campus? Report it, search
              reported items, and help belongings find their way
              back to their owners.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/items"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-900 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-blue-50"
              >
                Browse Items →
              </Link>

              <Link
                to="/report-item"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-1 hover:bg-white/20"
              >
                + Report an Item
              </Link>
            </div>

            <p className="mt-8 text-sm text-blue-200/70">
              Helping our campus community reconnect with lost belongings.
            </p>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
              <div className="rounded-2xl bg-white p-6 sm:p-8">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Lost & Found
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                      Find Your Belongings
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z"
                      />
                      <path
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 12 2 2 4-4"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl">
                      🎒
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">
                        Lost Item
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Report an item
                      </p>
                    </div>
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                      Lost
                    </span>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                      💧
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">
                        Found Item
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Help its owner
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                      Found
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center">
                  <p className="text-sm font-semibold text-blue-800">
                    Every lost item deserves to be found.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white px-5 py-4 shadow-xl sm:block">
              <p className="text-sm font-bold text-slate-800">
                Together We Help
              </p>
              <p className="mt-1 text-xs text-slate-500">
                One campus, one community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Get Started
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            How Can We Help You?
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Choose what you need to do.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <Link
            to="/items"
            className="group flex items-center gap-5 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg sm:p-8"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                <path d="m16 16 4 4" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">
                Find an Item
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Browse reported lost and found items on your campus.
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                Browse Items →
              </span>
            </div>
          </Link>

          <Link
            to="/report-item"
            className="group flex items-center gap-5 rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg sm:p-8"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-colors group-hover:bg-green-600 group-hover:text-white">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14m-7-7h14"
                />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">
                Report an Item
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Lost something or found an item? Submit a report.
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-green-700">
                Report Now →
              </span>
            </div>
          </Link>

        </div>
      </section>

      {/* Recent Items */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                Latest Reports
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                Recently Reported Items
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Explore some of the latest reported items.
              </p>
            </div>

            <Link
              to="/items"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-colors hover:text-blue-900"
            >
              View All Items →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loadingItems ? (
              <p className="col-span-full py-12 text-center text-slate-500">
                Loading recent items...
              </p>
            ) : itemsError ? (
              <p className="col-span-full py-12 text-center text-red-600">
                {itemsError}
              </p>
            ) : recentItems.length === 0 ? (
              <p className="col-span-full py-12 text-center text-slate-500">
                No items have been reported yet.
              </p>
            ) : (
              recentItems.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-16 items-start justify-between bg-slate-50 px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.status === "Lost"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-xs font-medium text-blue-700">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-3 line-clamp-2 min-h-10 text-sm text-slate-500">
                      {item.description || "No description available."}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-slate-500">
                      <p className="flex items-center gap-2">
                        <span>📍</span>
                        {item.location || "Location unavailable"}
                      </p>

                      <p className="flex items-center gap-2">
                        <span>📅</span>
                        {item.date
                          ? new Date(`${item.date}T00:00:00`).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Date unavailable"}
                      </p>
                    </div>

                    <Link
                      to={`/items/${item.id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-700 hover:text-white"
                    >
                      View Details →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-9 text-center">
            <Link
              to="/items"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-800"
            >
              Explore All Items →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            Simple Process
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            How It Works
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            Reconnecting lost belongings with their owners is simple.
            Follow these three steps.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                {step.icon}
              </div>

              <p className="mt-5 text-xs font-extrabold tracking-widest text-blue-700">
                STEP {step.number}
              </p>

              <h3 className="mt-2 text-lg font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;

