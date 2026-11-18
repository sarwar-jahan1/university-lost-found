import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page not found");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl font-black text-blue-600">404</p>

      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        Page not found
      </h1>

      <p className="mt-2 max-w-md text-slate-500">
        The page you are looking for does not exist or has been moved.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/dashboard"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>

        <Link
          to="/items"
          className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Browse Items
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
