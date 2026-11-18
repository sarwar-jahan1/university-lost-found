import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/authService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchCurrentUser();
      setUser(data);
    } catch (err) {
      setError(err.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Your account information.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
            Loading profile...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700">
            <p>{error}</p>

            <button
              onClick={loadProfile}
              className="mt-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                {(
                  user?.name ||
                  user?.fullName ||
                  user?.email ||
                  "S"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-slate-900">
                  {user?.name || user?.fullName || "Student"}
                </h2>

                <p className="truncate text-slate-500">
                  {user?.email || "Email not available"}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-5">
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-semibold text-slate-800">
                  {user?.name || user?.fullName || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-semibold text-slate-800">
                  {user?.email || "Not provided"}
                </p>
              </div>

              {user?.id !== undefined && (
                <div>
                  <p className="text-sm text-slate-500">User ID</p>
                  <p className="font-semibold text-slate-800">
                    {user.id}
                  </p>
                </div>
              )}
            </div>

            <p className="mt-6 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
              Profile editing is not available because the current
              backend API only provides profile viewing.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;