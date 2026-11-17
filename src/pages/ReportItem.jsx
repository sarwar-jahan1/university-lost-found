
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../Styles/ReportItem.css";

const normalizeItem = (item) => ({
  ...item,
  name: item.title,
  status: item.type === "LOST" ? "Lost" : "Found",
  date: item.eventDate,
});

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getItemList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await apiRequest("/api/items/");
        setReports(getItemList(data).map(normalizeItem));
      } catch (err) {
        setError(err.message || "Unable to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.date > getToday()) {
      setError("Event date cannot be in the future.");
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
        const data = await apiRequest("/api/items/");
        setReports(getItemList(data).map(normalizeItem));
      }

      resetForm();
      setSuccess("Your report has been submitted successfully.");
    } catch (err) {
      setError(err.message || "Unable to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-container">
      <h1>Report an Item</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="item-name">Item Name *</label>

          <input
            id="item-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
            required
          />
        </div>

        <div>
          <label>Lost or Found *</label>

          <label>
            <input
              type="radio"
              name="status"
              value="lost"
              checked={formData.status === "lost"}
              onChange={handleChange}
            />
            Lost Item
          </label>

          <label>
            <input
              type="radio"
              name="status"
              value="found"
              checked={formData.status === "found"}
              onChange={handleChange}
            />
            Found Item
          </label>
        </div>

        <div>
          <label htmlFor="item-location">Location *</label>

          <input
            id="item-location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where was it lost or found?"
            required
          />
        </div>

        <div>
          <label htmlFor="item-date">Date *</label>

          <input
            id="item-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            max={getToday()}
            required
          />
        </div>

        <div>
          <label htmlFor="item-description">
            Item Description *
          </label>

          <textarea
            id="item-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item in detail..."
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        {success && <p>{success}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>

      <div className="reports-section">
        <h2>All Reports</h2>

        {loading ? (
          <p className="empty-reports">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="empty-reports">
            No reports available.
          </p>
        ) : (
          reports.map((report) => (
            <div className="report-card" key={report.id}>
              <h3>{report.name}</h3>

              <span
                className={`report-status ${report.status.toLowerCase()}`}
              >
                {report.status}
              </span>

              <p>
                <strong>Location:</strong> {report.location}
              </p>

              <p>
                <strong>Date:</strong> {report.date}
              </p>

              <p>
                <strong>Description:</strong> {report.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportItem;
