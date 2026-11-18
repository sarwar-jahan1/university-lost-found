import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiRequest } from "../services/api";
import { updateItem } from "../services/itemService";
import ItemImage from "../components/ui/ItemImage";
import { Skeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/toastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const EditItem = () => {
  useDocumentTitle("Edit Item");

  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useToast();

  const [item, setItem] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await apiRequest(`/api/items/${id}/`);
        const itemData = data?.item || data;

        if (!itemData?.id) throw new Error("Item not found.");

        if (active) {
          setItem(itemData);
          setForm({
            title: itemData.title || "",
            type: String(itemData.type || "LOST").toUpperCase(),
            location: itemData.location || "",
            eventDate: itemData.eventDate || "",
            description: itemData.description || "",
          });
        }
      } catch (err) {
        if (active) setLoadError(err.message || "Failed to load item.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.eventDate ||
      !form.description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      await updateItem(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        location: form.location.trim(),
        eventDate: form.eventDate,
      });

      notify("Item updated.", "success");
      navigate(`/items/${id}`);
    } catch (err) {
      // 403 means the signed-in user is not the reporter
      const message = err.message || "Unable to update this item.";
      setError(message);
      notify(message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10" aria-busy="true">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    );
  }

  if (loadError || !form) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Item not found
        </h1>
        <p className="mt-2 text-slate-500">{loadError}</p>
        <Link
          to="/items"
          className="mt-5 inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to Items
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link
        to={`/items/${id}`}
        className="mb-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
      >
        ← Back to item
      </Link>

      <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Edit Item
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Only the person who reported this item can save changes.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="edit-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Item Name <span className="text-red-500">*</span>
            </label>

            <input
              id="edit-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
              className={inputClass}
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Lost or Found <span className="text-red-500">*</span>
            </span>

            <div className="grid grid-cols-2 gap-3">
              {["LOST", "FOUND"].map((type) => (
                <label
                  key={type}
                  className={`cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-semibold transition ${
                    form.type === type
                      ? type === "LOST"
                        ? "border-red-400 bg-red-50 text-red-700"
                        : "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={form.type === type}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  {type === "LOST" ? "Lost Item" : "Found Item"}
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-location"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Campus Location <span className="text-red-500">*</span>
              </label>

              <input
                id="edit-location"
                name="location"
                value={form.location}
                onChange={handleChange}
                maxLength={150}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="edit-date"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Date <span className="text-red-500">*</span>
              </label>

              <input
                id="edit-date"
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                max={today}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Item Description <span className="text-red-500">*</span>
            </label>

            <textarea
              id="edit-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              maxLength={1000}
              required
              className={inputClass}
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.description.length}/1000
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-3">
            <ItemImage
              item={item}
              zoom={false}
              className="h-16 w-16 shrink-0 rounded-md"
            />

            <p className="text-xs text-slate-500">
              The photo cannot be changed after the report is created.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to={`/items/${id}`}
              className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
