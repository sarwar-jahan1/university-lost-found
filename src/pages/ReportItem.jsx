import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useToast } from "../components/ui/toastContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import ItemImage from "../components/ui/ItemImage";
import { validateImageFile } from "../utils/items";
import "../Styles/ReportItem.css";

const normalizeItem = (item) => ({
  ...item,
  name: item.title || "Untitled Item",
  status: item.type === "LOST" ? "Lost" : "Found",
  date: item.eventDate || "",
});

const ReportItem = () => {
  useDocumentTitle("Report an Item");

  const { notify } = useToast();
  const nameInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Optional photo (sent as the multipart `image` part)
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);

  // Free the preview's temporary URL when it changes or the page closes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const selectImage = (file) => {
    if (!file) return;

    const problem = validateImageFile(file);

    if (problem) {
      setError(problem);
      notify(problem, "error");
      return;
    }

    setError("");
    setSuccess("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [formData, setFormData] = useState({
    name: "",
    status: "lost",
    location: "",
    date: "",
    description: "",
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const fetchReports = async () => {
    try {
      setError("");

      const data = await apiRequest("/api/items/");

      const itemList = Array.isArray(data)
        ? data
        : data?.content || data?.items || [];

      setReports(itemList.map(normalizeItem));
    } catch (err) {
      setError(err.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      status: "lost",
      location: "",
      date: "",
      description: "",
    });
    removeImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.location.trim() ||
      !formData.date ||
      !formData.description.trim()
    ) {
      setError("Please fill in all required fields.");
      notify("Please fill in all required fields.", "error");
      return;
    }

    try {
      setSubmitting(true);

      // The API expects multipart/form-data: five text parts plus an
      // optional `image` file part.
      const payload = new FormData();
      payload.append("title", formData.name.trim());
      payload.append("description", formData.description.trim());
      payload.append("type", formData.status.toUpperCase());
      payload.append("location", formData.location.trim());
      payload.append("eventDate", formData.date);

      if (image) payload.append("image", image);

      const createdItem = await apiRequest("/api/items/", {
        method: "POST",
        body: payload,
      });

      if (createdItem && createdItem.id) {
        setReports((previous) => [
          normalizeItem(createdItem),
          ...previous,
        ]);
      } else {
        await fetchReports();
      }

      resetForm();
      setSuccess("Your report has been submitted successfully.");
      notify("Report submitted successfully.", "success");
      nameInputRef.current?.focus({ preventScroll: true });
    } catch (err) {
      setError(err.message || "Unable to submit report.");
      notify(err.message || "Unable to submit report.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="report-page">
      <div className="report-wrapper">

        {/* Page Heading */}
        <div className="report-heading">
          <span className="report-eyebrow">
            CAMPUS LOST & FOUND
          </span>

          <h1>Report an Item</h1>

          <p>
            Help your campus community find lost belongings or return
            items to their rightful owners.
          </p>
        </div>

        {/* Report Form */}
        <section className="report-form-card">
          <div className="report-card-heading">
            <div className="report-heading-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>

            <div>
              <h2>Item Information</h2>
              <p>Fill in the details below to create a report.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="report-form">

            {/* Item Name */}
            <div className="report-field">
              <label htmlFor="item-name">
                Item Name <span>*</span>
              </label>

              <input
                id="item-name"
                ref={nameInputRef}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Samsung Galaxy Phone"
                maxLength={100}
                required
              />

              <div className="report-description-footer">
                <small>Enter a short and recognizable item name.</small>
                <small>{formData.name.length}/100</small>
              </div>
            </div>

            {/* Lost or Found */}
            <div className="report-field">
              <label>
                Lost or Found <span>*</span>
              </label>

              <div className="report-type-options">

                <label
                  className={`report-type-card ${
                    formData.status === "lost" ? "selected lost-selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="lost"
                    checked={formData.status === "lost"}
                    onChange={handleChange}
                  />

                  <span className="report-type-icon lost-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <path d="m16 16 4 4M11 8v4M11 15h.01" />
                    </svg>
                  </span>

                  <span className="report-type-text">
                    <strong>Lost Item</strong>
                    <small>I lost something</small>
                  </span>

                  <span className="report-type-check">
                    {formData.status === "lost" ? "✓" : ""}
                  </span>
                </label>

                <label
                  className={`report-type-card ${
                    formData.status === "found" ? "selected found-selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="found"
                    checked={formData.status === "found"}
                    onChange={handleChange}
                  />

                  <span className="report-type-icon found-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 11c0 5-8 10-8 10S4 16 4 11a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="11" r="2.5" />
                    </svg>
                  </span>

                  <span className="report-type-text">
                    <strong>Found Item</strong>
                    <small>I found something</small>
                  </span>

                  <span className="report-type-check">
                    {formData.status === "found" ? "✓" : ""}
                  </span>
                </label>

              </div>
            </div>

            {/* Location and Date */}
            <div className="report-field-grid">

              <div className="report-field">
                <label htmlFor="item-location">
                  Campus Location <span>*</span>
                </label>

                <div className="report-input-with-icon">
                  <span className="report-input-icon">📍</span>

                  <input
                    id="item-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where was it lost or found?"
                    maxLength={150}
                    required
                  />
                </div>
              </div>

              <div className="report-field">
                <label htmlFor="item-date">
                  Date <span>*</span>
                </label>

                <div className="report-input-with-icon">
                  <span className="report-input-icon">📅</span>

                  <input
                    id="item-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    max={today}
                    required
                  />
                </div>
              </div>

            </div>

            {/* Description */}
            <div className="report-field">
              <label htmlFor="item-description">
                Item Description <span>*</span>
              </label>

              <textarea
                id="item-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the item in detail. Include its color, brand, identifying marks, or other useful information..."
                rows="5"
                maxLength={1000}
                required
              />

              <div className="report-description-footer">
                <small>
                  Provide enough details to help identify the item.
                </small>

                <small>
                  {formData.description.length}/1000
                </small>
              </div>
            </div>

            {/* Photo (optional) */}
            <div className="report-field">
              <label htmlFor="item-photo">
                Photo <small>(optional)</small>
              </label>

              <input
                id="item-photo"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => selectImage(e.target.files?.[0])}
              />

              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={preview}
                    alt="Selected item preview"
                    className="mx-auto max-h-64 w-full object-contain"
                  />

                  <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-2.5 text-sm">
                    <span className="min-w-0 truncate text-slate-600">
                      {image?.name}{" "}
                      <span className="text-slate-400">
                        ({(image.size / 1024).toFixed(0)} KB)
                      </span>
                    </span>

                    <span className="flex shrink-0 gap-3 font-semibold">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-blue-600 hover:underline"
                      >
                        Change
                      </button>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </span>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="item-photo"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    selectImage(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                    dragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                >
                  <svg
                    className="h-9 w-9 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                  </svg>

                  <span className="text-sm font-semibold text-slate-700">
                    Click to upload or drag a photo here
                  </span>

                  <span className="text-xs text-slate-400">
                    JPG, PNG or WEBP · up to 5 MB
                  </span>
                </label>
              )}

              <small>
                A clear photo helps the owner recognise the item.
              </small>
            </div>

            {/* Error Message */}
            {error && (
              <div className="report-alert report-alert-error" role="alert">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="report-alert report-alert-success" role="status">
                <span>✓</span>
                <p>{success}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="report-submit-button"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="report-spinner" />
                  Submitting Report...
                </>
              ) : (
                <>
                  Submit Report
                  <span>→</span>
                </>
              )}
            </button>

            <p className="report-form-note">
              <span>*</span> All fields are required.
            </p>

          </form>
        </section>

        {/* All Reports */}
        <section className="all-reports-section">
          <div className="all-reports-heading">
            <div>
              <span className="report-eyebrow">CAMPUS COMMUNITY</span>
              <h2>All Reports</h2>
              <p>Recently reported lost and found items.</p>
            </div>

            <span className="report-count">
              {reports.length} Reports
            </span>
          </div>

          {loading ? (
            <div className="reports-loading">
              <span className="report-spinner" />
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="reports-empty">
              <div>📦</div>
              <h3>No reports yet</h3>
              <p>Be the first to report a lost or found item.</p>
            </div>
          ) : (
            <div className="reports-grid">
              {reports.map((report) => (
                <article className="report-list-card group" key={report.id}>
                  <ItemImage
                    item={report}
                    className="mb-3 aspect-[16/9] w-full rounded-lg"
                  />

                  <div className="report-list-top">
                    <span
                      className={`report-status-badge ${
                        report.status.toLowerCase()
                      }`}
                    >
                      {report.status}
                    </span>

                    <span className="report-item-id">
                      #{report.id}
                    </span>
                  </div>

                  <h3>
                    <Link to={`/items/${report.id}`}>{report.name}</Link>
                  </h3>

                  <p className="report-list-description">
                    {report.description || "No description available."}
                  </p>

                  <div className="report-list-meta">
                    <span>
                      <span>📍</span>
                      {report.location || "Location unavailable"}
                    </span>

                    <span>
                      <span>📅</span>
                      {formatDate(report.date)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default ReportItem;