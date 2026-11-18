
import { useState } from "react";
import { Navigate } from "react-router-dom";

import {
  signupUser,
  loginUser,
  isAuthenticated,
} from "../services/authService";
import { EyeIcon } from "../components/ui/Icons";
import AuthHero, { RotatingWord } from "../components/AuthHero";
import useDocumentTitle from "../hooks/useDocumentTitle";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const getStrength = (value) => {
  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score += 1;

  const levels = [
    { label: "Too short", color: "bg-slate-300", text: "text-slate-500" },
    { label: "Weak", color: "bg-red-400", text: "text-red-600" },
    { label: "Fair", color: "bg-amber-400", text: "text-amber-600" },
    { label: "Good", color: "bg-lime-500", text: "text-lime-600" },
    { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" },
  ];

  return { score, ...levels[value ? score : 0] };
};

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useDocumentTitle(activeTab === "signin" ? "Sign In" : "Sign Up");

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (activeTab === "signup") {
        await signupUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });

        setSuccess("Account created successfully. Please Sign In.");

        setActiveTab("signin");
        setName("");
        setPassword("");
      } else {
        await loginUser({
          email: email.trim(),
          password,
        });

        // Reload app with the newly logged-in user
        window.location.replace("/dashboard");
        return;
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  };

  const strength = getStrength(password);

  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.15fr_1fr]">

      <AuthHero />

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="animate-fade-up w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-md shadow-blue-600/25 lg:hidden">
              LF
            </div>

            <p className="mb-3 text-lg font-extrabold text-slate-900 lg:hidden">
              Lost your{" "}
              <span className="text-blue-600">
                <RotatingWord />
              </span>
              ?
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === "signin"
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p className="mt-2 text-slate-500">
              {activeTab === "signin"
                ? "Sign in to Campus Lost & Found"
                : "Join the campus Lost & Found community"}
            </p>
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1"
          >
            {[
              { id: "signin", label: "Sign In" },
              { id: "signup", label: "Sign Up" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => switchTab(tab.id)}
                className={`rounded-md py-2.5 font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {activeTab === "signup" && (
              <div className="animate-fade">
                <label
                  htmlFor="auth-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) =>
                    setCapsLock(e.getModifierState?.("CapsLock") ?? false)
                  }
                  onBlur={() => setCapsLock(false)}
                  placeholder="Enter your password"
                  autoComplete={
                    activeTab === "signup"
                      ? "new-password"
                      : "current-password"
                  }
                  required
                  minLength={6}
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((show) => !show)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>

              {capsLock && (
                <p className="mt-2 text-xs font-semibold text-amber-600">
                  ⚠ Caps Lock is on
                </p>
              )}

              {activeTab === "signup" && password && (
                <div className="animate-fade mt-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((segment) => (
                      <span
                        key={segment}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          strength.score >= segment
                            ? strength.color
                            : "bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>

                  <p className={`mt-1.5 text-xs font-semibold ${strength.text}`}>
                    {strength.label}
                    <span className="font-normal text-slate-400">
                      {" "}
                      · at least 6 characters
                    </span>
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="animate-fade rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="animate-fade rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
              >
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {loading
                ? "Please wait..."
                : activeTab === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {activeTab === "signin"
              ? "New to Campus Lost & Found? "
              : "Already have an account? "}

            <button
              type="button"
              onClick={() =>
                switchTab(activeTab === "signin" ? "signup" : "signin")
              }
              className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              {activeTab === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
