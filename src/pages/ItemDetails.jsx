
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import ClaimForm from "../components/ClaimForm";
import "./ItemDetails.css";

const normalizeItem = (item) => ({
  ...item,
  id: item.id,
  name: item.title || item.name || "Untitled Item",
  status:
    item.type === "LOST"
      ? "Lost"
      : item.type === "FOUND"
        ? "Found"
        : item.status || item.type,
  date: item.eventDate || item.date,
  category: item.category || "Other",
});

const ItemDetails = () => {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");
        setItem(null);

        const data = await apiRequest(`/api/items/${id}/`);
        const itemData = data?.item || data;

        if (!itemData || !itemData.id) {
          throw new Error("Item not found.");
        }

        if (active) {
          setItem(normalizeItem(itemData));
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load item.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="details-not-found">
        <h1>Loading item...</h1>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="details-not-found">
        <h1>Item Not Found</h1>
        <p>{error || "The requested item does not exist."}</p>

        <Link to="/items">Back to Items</Link>
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
          <div className="details-content">

            <span
              className={`details-status ${item.status.toLowerCase()}`}
            >
              {item.status}
            </span>

            <span className="details-category">
              {item.category}
            </span>

            <h1>{item.name}</h1>

            <p>📍 Location: {item.location || "Not available"}</p>

            <p>
              📅 Date:{" "}
              {item.date
                ? new Date(`${item.date}T00:00:00`).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                : "Date unavailable"}
            </p>

            <hr />

            <h2>Item Description</h2>

            <p>
              {item.description || "No description available."}
            </p>

            <button
              type="button"
              onClick={() => setShowClaimForm(true)}
              className="details-claim-button"
            >
              Claim This Item →
            </button>

          </div>
        </div>

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
