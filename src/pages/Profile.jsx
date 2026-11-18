import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCurrentUser } from "../services/authService";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/toastContext";
import { ArrowIcon, CopyIcon } from "../components/ui/Icons";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Profile = () => {
  useDocumentTitle("My Profile");

  const { notify } = useToast();

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

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(String(value));
      notify(`${label} copied.`, "success");
    } catch {
      notify(`Could not copy ${label.toLowerCase()}.`, "error");
    }
  };

  const fields = [
    { label: "Name", value: user?.name || user?.fullName, empty: "Not provided" },
    { label: "Email", value: user?.email, empty: "Not provided", copyable: true },
    ...(user?.id !== undefined
      ? [{ label: "User ID", value: user.id, copyable: true }]
      : []),
  ];

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="animate-fade-up mb-7">
          <h1 className="text-3xl font-extrabold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Your account information.
          </p>
        </div>

        {loading ? (
          <div
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            aria-busy="true"
            aria-label="Loading profile"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 !rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-56" />
              </div>
            </div>
            <Skeleton className="mt-8 h-4 w-24" />
            <Skeleton className="mt-2 h-5 w-48" />
            <Skeleton className="mt-6 h-4 w-24" />
            <Skeleton className="mt-2 h-5 w-64" />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 p-6 text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={loadProfile}
              className="mt-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="animate-fade-up overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-600" />

              <div className="px-6 pb-6">
                <div className="-mt-9 mb-6 flex items-end gap-4">
                  <div className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-white bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm [height:4.5rem] [width:4.5rem]">
                    {(
                      user?.name ||
                      user?.fullName ||
                      user?.email ||
                      "S"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 pb-1">
                    <h2 className="truncate text-xl font-bold text-slate-900">
                      {user?.name || user?.fullName || "Student"}
                    </h2>

                    <p className="truncate text-sm text-slate-500">
                      {user?.email || "Email not available"}
                    </p>
                  </div>
                </div>

                <dl className="divide-y divide-slate-100 border-t border-slate-100">
                  {fields.map((field) => {
                    const hasValue =
                      field.value !== undefined &&
                      field.value !== null &&
                      field.value !== "";

                    return (
                      <div
                        key={field.label}
                        className="flex items-center justify-between gap-4 py-4"
                      >
                        <div className="min-w-0">
                          <dt className="text-sm text-slate-500">
                            {field.label}
                          </dt>
                          <dd className="truncate font-semibold text-slate-800">
                            {hasValue ? field.value : field.empty}
                          </dd>
                        </div>

                        {field.copyable && hasValue && (
                          <button
                            type="button"
                            onClick={() => copy(field.label, field.value)}
                            aria-label={`Copy ${field.label}`}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <CopyIcon className="h-3.5 w-3.5" />
                            Copy
                          </button>
                        )}
                      </div>
                    );
                  })}
                </dl>

                <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                  Profile editing is not available because the current
                  backend API only provides profile viewing.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                to="/track-claim"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  <p className="font-bold text-slate-900">My Claims</p>
                  <p className="text-sm text-slate-500">
                    Check the status of your claims
                  </p>
                </div>
                <ArrowIcon className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/report-item"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
              >
                <div>
                  <p className="font-bold text-slate-900">Report an Item</p>
                  <p className="text-sm text-slate-500">
                    Lost or found something?
                  </p>
                </div>
                <ArrowIcon className="h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;
