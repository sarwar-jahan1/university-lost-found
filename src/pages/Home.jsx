
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

      {/* =====================================
          PREMIUM HERO SECTION
      ====================================== */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#101f49] via-[#1c3d89] to-[#292b78] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

        {/* Background Effects */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-blue-400/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-52 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-3xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">

          {/* LEFT CONTENT */}
          <div className="animate-[heroFade_.8s_ease-out] text-center lg:text-left">

            <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-200/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-blue-100 shadow-lg backdrop-blur-md sm:text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>

              Campus Lost & Found Community
            </div>

            <h1 className="mx-auto mt-8 max-w-2xl text-5xl leading-[1.12] font-black tracking-tight text-white sm:text-6xl lg:mx-0 lg:text-7xl">
              Lost Something?

              <span className="mt-3 block bg-gradient-to-r from-blue-200 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
                Let's Find It
              </span>

              <span className="mt-1 block text-white">
                Together.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-blue-100/80 sm:text-lg lg:mx-0">
              Lost or found something on campus? Report it, search
              reported items, and help belongings find their way
              back to their owners.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

              <Link
                to="/items"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-white px-7 py-3.5 text-sm font-extrabold text-blue-900 shadow-xl shadow-blue-950/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-2xl"
              >
                Browse Items

                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                to="/report-item"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-extrabold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/20"
              >
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 5v14m-7-7h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                Report an Item
              </Link>

            </div>

            {/* Trust Line */}
            <div className="mt-9 flex items-center justify-center gap-3 text-xs text-blue-200/80 sm:text-sm lg:justify-start">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-300">
                ✓
              </span>

              Helping our campus community reconnect with lost belongings.
            </div>

          </div>

          {/* RIGHT VISUAL */}
          <div className="relative mx-auto w-full max-w-[510px] animate-[heroFade_.9s_ease-out]">

            {/* Decorative Circles */}
            <div className="absolute left-1/2 top-1/2 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

            <div className="absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />

            {/* Main Card */}
            <div className="relative rounded-[28px] border border-white/25 bg-white/15 p-3 shadow-2xl shadow-blue-950/40 backdrop-blur-xl sm:p-4">

              <div className="rounded-[21px] bg-white p-5 shadow-inner sm:p-8">

                {/* Card Heading */}
                <div className="flex items-center justify-between gap-4">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Lost & Found
                    </p>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                      Find Your Belongings
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 sm:h-14 sm:w-14">
                    <svg
                      className="h-7 w-7 sm:h-8 sm:w-8"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />

                      <path
                        d="m9 12 2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                </div>

                {/* Lost Item */}
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-md sm:gap-4 sm:p-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-2xl sm:h-14 sm:w-14">
                    🎒
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                      Lost Item
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Report an item
                    </p>
                  </div>

                  <span className="rounded-full bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700">
                    Lost
                  </span>

                </div>

                {/* Found Item */}
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-md sm:gap-4 sm:p-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl sm:h-14 sm:w-14">
                    💧
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                      Found Item
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Help its owner
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    Found
                  </span>

                </div>

                {/* Bottom Message */}
                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-4 text-center text-xs font-bold text-blue-800 sm:text-sm">
                  <span className="text-lg text-blue-600">✦</span>
                  Every lost item deserves to be found.
                </div>

              </div>
            </div>

            {/* Floating Community Card */}
            <div className="absolute -bottom-7 left-1/2 flex w-[260px] -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-2xl shadow-blue-950/25 sm:left-0 sm:w-auto sm:translate-x-0">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-800">
                  Together We Help
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  One campus, one community.
                </p>
              </div>

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                ✓
              </span>

            </div>

            {/* Floating Decorations */}
            <div className="absolute -right-3 top-8 h-4 w-4 rotate-45 rounded-sm bg-blue-200 shadow-lg shadow-blue-300/50 sm:-right-7" />

            <div className="absolute -bottom-3 right-8 h-3 w-3 rotate-45 rounded-sm bg-emerald-300 shadow-lg shadow-emerald-300/50" />

          </div>

        </div>

        <style>{`
          @keyframes heroFade {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .hero-motion {
              animation: none !important;
            }
          }
        `}</style>

      </section>

      {/* =====================================
          QUICK ACTION CARDS
      ====================================== */}
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

      {/* =====================================
          RECENT ITEMS
      ====================================== */}
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

      {/* =====================================
          HOW IT WORKS
      ====================================== */}
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

      <style>{`
        @keyframes heroFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
};

export default Home;
