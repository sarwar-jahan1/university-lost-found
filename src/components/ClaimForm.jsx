
import { useState } from "react";
import { apiRequest } from "../services/api";
import "./ClaimForm.css";

const ClaimForm = ({ itemId, onClose }) => {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Please describe why this item belongs to you.");
      return;
    }

    try {
      setSubmitting(true);

      await apiRequest("/api/claims/", {
        method: "POST",
        body: JSON.stringify({
          itemId: Number(itemId),
          description: description.trim(),
        }),
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Unable to submit your claim.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="claim-overlay">
        <div className="claim-card text-center">
          <h2>Claim Submitted Successfully!</h2>

          <p>Your claim request has been submitted.</p>

          <p>
            Your claim status is currently <strong>Pending</strong>.
          </p>

          <p>
            You can check your submitted claims from the Track Claim page.
          </p>

          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-overlay">
      <div className="claim-card">
        <button
          type="button"
          className="claim-close"
          onClick={onClose}
          aria-label="Close claim form"
        >
          ✕
        </button>

        <h2>Claim This Item</h2>

        <p>
          Describe the item or provide details that can help verify your
          ownership.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="claim-description">
            Why is this item yours?
          </label>

          <textarea
            id="claim-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the item or provide proof of ownership..."
            required
          />

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Claim"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
