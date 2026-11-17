import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../Styles/ReportItem.css";

const normalizeItem = (item) => ({
  ...item,
  name: item.title || "Untitled Item",
  status: item.type === "LOST" ? "Lost" : "Found",
  date: item.eventDate || "",
});

const ReportItem = () => {
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
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        title: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.status.toUpperCase(),
        location: formData.location.trim(),
        eventDate: formData.date,
      };

      const createdItem = await apiRequest("/api/items/", {
        method: "POST",
        body: JSON.stringify(payload),
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
    } catch (err) {
      setError(err.message || "Unable to submit report.");
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
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Samsung Galaxy Phone"
                maxLength={100}
                required
              />

              <small>Enter a short and recognizable item name.</small>
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
                <article className="report-list-card" key={report.id}>
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

                  <h3>{report.name}</h3>

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