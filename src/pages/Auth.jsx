
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";

const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await loginUser(form.email, form.password);
      } else {
        await registerUser(
          form.name,
          form.email,
          form.password
        );
      }

      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 md:grid md:grid-cols-2">

        {/* Left Design Panel */}
        <div className="relative hidden min-h-[600px] flex-col justify-between overflow-hidden bg-blue-950 p-10 text-white md:flex">

          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-600/30 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-xl font-bold text-blue-800">
              LF
            </div>

            <div>
              <h2 className="font-bold">Campus Lost & Found</h2>
              <p className="text-xs text-blue-200">
                University Community Platform
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-6 inline-flex rounded-full border border-blue-400/30 bg-blue-500/20 px-4 py-2 text-sm text-blue-100">
              Welcome to our campus community
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Lost something?
              <br />
              Let's find it
              <br />
              together.
            </h1>

            <p className="mt-5 max-w-sm leading-7 text-blue-100">
              A simple platform to report lost items,
              discover found belongings and reconnect
              people with what matters.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/15 pt-5 text-sm text-blue-200">
            © 2026 Campus Lost & Found
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex items-center justify-center p-6 sm:p-10 md:p-12">

          <div className="w-full max-w-md">

            <div className="mb-8 md:hidden">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
                LF
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Campus Lost & Found
              </h2>
            </div>

            <div className="mb-7">
              <p className="mb-2 text-sm font-semibold text-blue-700">
                YOUR CAMPUS, YOUR COMMUNITY
              </p>

              <h2 className="text-3xl font-bold text-slate-900">
                {mode === "login"
                  ? "Welcome back!"
                  : "Create an account"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {mode === "login"
                  ? "Sign in to continue to your account."
                  : "Sign up to access Campus Lost & Found."}
              </p>
            </div>

            {/* Login / Signup Toggle */}
            <div className="mb-7 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`rounded-lg py-3 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => switchMode("signup")}
                className={`rounded-lg py-3 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-700 py-3.5 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
              </button>

            </form>

            <p className="mt-7 text-center text-xs leading-5 text-slate-400">
              Campus Lost & Found Management System
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
