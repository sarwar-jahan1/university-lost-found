
import React, { useState } from "react";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Claim Details:", {
      itemId,
      ...formData,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="claim-overlay">
        <div className="claim-card text-center">
          <h2>Claim Submitted Successfully!</h2>
          <p>Your claim request has been recorded in this demo.</p>
          <button onClick={onClose}>Close</button>
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
