
import { useState } from "react";
import { Navigate } from "react-router-dom";

import {
  signupUser,
  loginUser,
  isAuthenticated,
} from "../services/authService";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("signin");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
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
        window.location.replace("/home");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white shadow-md">
            LF
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Campus Lost & Found
          </h1>

          <p className="mt-2 text-slate-500">
            Find what matters
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => switchTab("signin")}
            className={`rounded-md py-2.5 font-semibold transition ${
              activeTab === "signin"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => switchTab("signup")}
            className={`rounded-md py-2.5 font-semibold transition ${
              activeTab === "signup"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-blue-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {activeTab === "signup" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete={
                activeTab === "signup"
                  ? "new-password"
                  : "current-password"
              }
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : activeTab === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
