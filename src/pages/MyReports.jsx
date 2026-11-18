import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../services/api";
import { deleteItem } from "../services/itemService";
import { getMyItemIds, removeMyItemId } from "../utils/myItems";
import ItemCard from "../components/ItemCard";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { ItemCardSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/toastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const MyReports = () => {
  useDocumentTitle("My Reports");

  const { notify } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await apiRequest("/api/items/");
        const mine = getMyItemIds();

        if (active) {
          setItems(
            toList(data).filter((item) => mine.includes(String(item.id)))
          );
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load your reports.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await deleteItem(toDelete.id);

      removeMyItemId(toDelete.id);
      setItems((current) => current.filter((item) => item.id !== toDelete.id));
      notify("Item deleted.", "success");
      setToDelete(null);
    } catch (err) {
      notify(err.message || "Unable to delete this item.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="animate-fade-up mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            My Reports
          </h1>

          <p className="mt-2 text-slate-600">
            Items you reported from this device. Edit or delete them here.
          </p>
        </div>

        <Link
          to="/report-item"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          + Report an Item
        </Link>
      </div>

      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-3 text-sm font-semibold underline"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            📋
          </div>

          <h2 className="text-lg font-bold text-slate-800">
            No reports from this device yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Items you report from here show up in this list. For an item
            you reported earlier or on another device, open it and use
            &ldquo;Reporter options&rdquo; to edit or delete it.
          </p>

          <Link
            to="/items"
            className="mt-5 inline-block rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Browse Items
          </Link>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex-1">
                <ItemCard item={item} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to={`/items/${item.id}/edit`}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => setToDelete(item)}
                  className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toDelete && (
        <ConfirmDialog
          danger
          busy={deleting}
          title="Delete this item?"
          message={`"${toDelete.title || "This item"}" will be removed permanently for everyone. This cannot be undone.`}
          confirmLabel="Yes, delete"
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
};

export default MyReports;
