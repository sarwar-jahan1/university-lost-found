
import { useState } from "react";
import "../Styles/ReportItem.css";

const STORAGE_KEY = "campus_lost_found_items";

const ReportItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    status: "lost",
    category: "",
    location: "",
    date: "",
    description: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [reports, setReports] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Image size must be less than 1 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);

      setFormData((previous) => ({
        ...previous,
        image: reader.result,
      }));

      setError("");
    };

    reader.readAsDataURL(file);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      status: "lost",
      category: "",
      location: "",
      date: "",
      description: "",
      image: "",
    });

    setImagePreview("");
    setError("");

    const fileInput = document.getElementById("report-image");
    if (fileInput) fileInput.value = "";
  };

  // Submit report
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    try {
      const newReport = {
        ...formData,
        id: `user-${Date.now()}`,
        status:
          formData.status.charAt(0).toUpperCase() +
          formData.status.slice(1),
        image: formData.image || "",
      };

      const savedData = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      const updatedReports = [
        newReport,
        ...(Array.isArray(savedData) ? savedData : []),
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedReports)
      );

      setReports(updatedReports);
      resetForm();
    } catch (err) {
      console.error("Report submission error:", err);
      setError("Unable to submit report. Please try again.");
    }
  };

  // Delete report
  const handleDelete = (id) => {
    const updatedReports = reports.filter(
      (report) => String(report.id) !== String(id)
    );

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedReports)
      );

      setReports(updatedReports);
    } catch (err) {
      console.error("Could not delete report:", err);
      setError("Unable to delete report.");
    }
  };

  return (
    <div className="report-container">

      <h1>Report an Item</h1>

      <form onSubmit={handleSubmit}>

        {/* Item Name */}
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

        {/* Lost or Found */}
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

        <p>{formData.status} Item</p>

        {/* Category */}
        <div>
          <label htmlFor="item-category">Category *</label>

          <select
            id="item-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Bags">Bags</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Personal Accessories">
              Personal Accessories
            </option>
            <option value="Documents">Documents</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Location */}
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

        {/* Date */}
        <div>
          <label htmlFor="item-date">Date *</label>

          <input
            id="item-date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
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

        {/* Image Upload */}
        <div>
          <label htmlFor="report-image">Item Image</label>

          <input
            id="report-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Item preview"
            />
          )}
        </div>

        {/* Error */}
        {error && <p className="form-error">{error}</p>}

        {/* Submit */}
        <button type="submit">
          Submit Report
        </button>

      </form>

      {/* Submitted Reports */}
      <div className="reports-section">

        <h2>Submitted Reports</h2>

        {reports.length === 0 ? (
          <p className="empty-reports">
            No reports submitted yet.
          </p>
        ) : (
          reports.map((report) => (
            <div className="report-card" key={report.id}>

              {report.image && (
                <img
                  src={report.image}
                  alt={report.name}
                />
              )}

              <h3>{report.name}</h3>

              <span
                className={`report-status ${report.status.toLowerCase()}`}
              >
                {report.status}
              </span>

              <p>
                <strong>Category:</strong> {report.category}
              </p>

              <p>
                <strong>Location:</strong> {report.location}
              </p>

              <p>
                <strong>Date:</strong> {report.date}
              </p>

              <p>
                <strong>Description:</strong> {report.description}
              </p>

              <button
                type="button"
                onClick={() => handleDelete(report.id)}
              >
                Delete Report
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default ReportItem;
