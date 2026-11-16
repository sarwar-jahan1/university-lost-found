
import { useState } from "react";
import "./ClaimForm.css";

const ClaimForm = ({ itemId, onClose }) => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    email: "",
    phone: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [claimCode, setClaimCode] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a demo claim code
    const generatedCode =
      "CLM-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const claimData = {
      itemId,
      ...formData,
      claimCode: generatedCode,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    };

    // Save demo claim data in localStorage
    const existingClaims = JSON.parse(
      localStorage.getItem("campus_claims") || "[]"
    );

    localStorage.setItem(
      "campus_claims",
      JSON.stringify([...existingClaims, claimData])
    );

    setClaimCode(generatedCode);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="claim-overlay">
        <div className="claim-card text-center">
          <h2>Claim Submitted Successfully!</h2>

          <p>Your claim request has been recorded.</p>

          <p>
            Your Claim Code:
            <strong className="ml-2 text-blue-600">
              {claimCode}
            </strong>
          </p>

          <p>Please save this code to track your claim status.</p>

          <button onClick={onClose}>
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
        >
          ✕
        </button>

        <h2>Claim This Item</h2>

        <p>Enter your information to claim this item.</p>

        <form onSubmit={handleSubmit}>

          <label>Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <label>Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="Enter your student ID"
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />

          <label>Why is this item yours?</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item or provide proof of ownership"
            required
          />

          <button type="submit">
            Submit Claim
          </button>

        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
