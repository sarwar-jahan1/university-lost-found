
import { useEffect, useState } from "react";

const WORDS = ["wallet", "phone", "ID card", "keys", "laptop", "water bottle"];

const STEPS = [
  {
    title: "Report",
    text: "Post a lost or found item with its location and date.",
  },
  {
    title: "Search",
    text: "Browse everything reported across campus in seconds.",
  },
  {
    title: "Claim",
    text: "Submit a claim and follow its status until it is approved.",
  },
];

// Headline word that cycles through common lost items
export const RotatingWord = ({ className = "" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % WORDS.length),
      2200
    );

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      key={WORDS[index]}
      className={`animate-fade-up inline-block ${className}`}
    >
      {WORDS[index]}
    </span>
  );
};

const ReportMock = () => (
  <div className="space-y-3">
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
      Black Leather Wallet
    </div>

    <div className="flex gap-2">
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
        ● Lost
      </span>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
        Found
      </span>
    </div>

    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
      📍 Central Library
    </div>

    <div className="rounded-lg bg-blue-600 py-2 text-center text-sm font-bold text-white">
      Submit Report →
    </div>
  </div>
);

const SearchMock = () => (
  <div className="space-y-3">
    <div className="rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm text-slate-700 ring-2 ring-blue-100">
      🔍 wallet
    </div>

    {[
      { name: "Black Leather Wallet", tag: "Lost", color: "red" },
      { name: "Brown Wallet", tag: "Found", color: "emerald" },
    ].map((row) => (
      <div
        key={row.name}
        className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5"
      >
        <span className="text-sm font-semibold text-slate-800">
          {row.name}
        </span>

        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            row.color === "red"
              ? "bg-red-100 text-red-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {row.tag}
        </span>
      </div>
    ))}
  </div>
);

const ClaimMock = () => (
  <ol className="space-y-3">
    {[
      { label: "Claim submitted", state: "done" },
      { label: "Reporter is reviewing", state: "active" },
      { label: "Approved — collect your item", state: "todo" },
    ].map((row) => (
      <li key={row.label} className="flex items-center gap-3">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            row.state === "done"
              ? "bg-emerald-500 text-white"
              : row.state === "active"
                ? "bg-amber-400 text-white"
                : "bg-slate-200 text-slate-400"
          }`}
        >
          {row.state === "done" ? "✓" : row.state === "active" ? "…" : ""}
        </span>

        <span
          className={`text-sm ${
            row.state === "todo"
              ? "text-slate-400"
              : "font-semibold text-slate-800"
          }`}
        >
          {row.label}
        </span>
      </li>
    ))}
  </ol>
);

const mocks = [ReportMock, SearchMock, ClaimMock];

const AuthHero = () => {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Auto-advance the demo unless the visitor is interacting with it
  useEffect(() => {
    if (paused) return undefined;

    const timer = window.setInterval(
      () => setStep((current) => (current + 1) % STEPS.length),
      4000
    );

    return () => window.clearInterval(timer);
  }, [paused]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setTilt({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  const Mock = mocks[step];

  return (
    <aside
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative hidden overflow-hidden bg-gradient-to-br from-[#101f49] via-[#1c3d89] to-[#292b78] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14"
    >
      {/* Background blobs that follow the cursor */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-3xl transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${tilt.x * -24}px, ${tilt.y * -24}px, 0)`,
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-indigo-400/25 blur-3xl transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${tilt.x * 28}px, ${tilt.y * 28}px, 0)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Brand */}
      <div className="relative flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-lg font-extrabold backdrop-blur">
          LF
        </div>
        <span className="text-lg font-bold">Campus Lost & Found</span>
      </div>

      {/* Hero */}
      <div className="relative">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-200/20 bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          Campus Lost & Found Community
        </div>

        <h1 className="mt-5 text-4xl font-black leading-tight xl:text-5xl">
          Lost your
          <span className="block min-h-[1.2em]">
            <RotatingWord className="bg-gradient-to-r from-blue-200 via-sky-300 to-indigo-200 bg-clip-text text-transparent" />
            <span className="text-sky-300">?</span>
          </span>
          <span className="block">Let's find it.</span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-blue-100/80">
          Report it, search reported items, and help belongings find
          their way back to their owners.
        </p>

        {/* Interactive how-it-works */}
        <div
          className="mt-8 max-w-lg"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            role="tablist"
            aria-label="How it works"
            className="mb-3 grid grid-cols-3 gap-2"
          >
            {STEPS.map((item, index) => (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={step === index}
                onClick={() => {
                  setStep(index);
                  setPaused(true);
                }}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm font-bold transition ${
                  step === index
                    ? "border-white/60 bg-white text-blue-900 shadow-lg"
                    : "border-white/15 bg-white/10 text-blue-100 hover:bg-white/20"
                }`}
              >
                <span className="block text-[10px] font-extrabold tracking-widest opacity-60">
                  STEP 0{index + 1}
                </span>
                {item.title}
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl border border-white/20 bg-white/15 p-2 shadow-2xl shadow-blue-950/40 backdrop-blur-xl transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${tilt.x * 8}px, ${tilt.y * 8}px, 0)`,
            }}
          >
            <div
              key={step}
              className="animate-pop rounded-xl bg-white p-5 text-slate-800"
            >
              <p className="mb-4 text-sm text-slate-500">
                {STEPS[step].text}
              </p>

              <Mock />
            </div>
          </div>

          {/* Progress dots */}
          <div className="mt-4 flex justify-center gap-2">
            {STEPS.map((item, index) => (
              <span
                key={item.title}
                className={`h-1.5 rounded-full transition-all ${
                  step === index ? "w-8 bg-white" : "w-3 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="relative text-sm text-blue-200/70">
        Every lost item deserves to be found.
      </p>
    </aside>
  );
};

export default AuthHero;
