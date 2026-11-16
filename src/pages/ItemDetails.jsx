
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import demoItems from "../data/items";
import ClaimForm from "../components/ClaimForm";
import "./ItemDetails.css";


const ItemDetails = () => {
  const { id } = useParams();

  const [showClaimForm, setShowClaimForm] = useState(false);

  const item = demoItems.find(
    (currentItem) => String(currentItem.id) === String(id)
  );

  if (!item) {
    return (
      <div className="details-not-found">
        <h1>Item Not Found</h1>
        <p>The requested item does not exist.</p>

        <Link to="/items">
          Back to Items
        </Link>
      </div>
    );
  }

  return (
    <section className="details-page">
      <div className="details-container">

        <Link to="/items" className="details-back">
          ← Back to Items
        </Link>

        <div className="details-card">

          {/* Item Image */}
          <div className="details-image-wrapper">
            <img
              src={item.image}
              alt={item.name}
            />

            <span
              className={`details-status ${item.status.toLowerCase()}`}
            >
              {item.status}
            </span>
          </div>

          {/* Item Information */}
          <div className="details-content">

            <span className="details-category">
              {item.category}
            </span>

            <h1>{item.name}</h1>

            <p>
              📍 Location: {item.location}
            </p>

            <p>
              📅 Date:{" "}
              {new Date(
                item.date + "T00:00:00"
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <p>
              Reported By: University Student
            </p>

            <hr />

            <h2>Item Description</h2>

            <p>{item.description}</p>

            {/* Claim Button */}
            {item.status === "Found" ? (
              <button
                type="button"
                onClick={() => setShowClaimForm(true)}
                className="details-claim-button"
              >
                Claim This Item →
              </button>
            ) : (
              <Link
                to="/track-claim"
                className="details-claim-button"
              >
                Track Claim →
              </Link>
            )}

          </div>
        </div>

        {/* Claim Form Popup */}
        {showClaimForm && (
          <ClaimForm
            itemId={item.id}
            onClose={() => setShowClaimForm(false)}
          />
        )}

      </div>
    </section>
  );
};

export default ItemDetails;
