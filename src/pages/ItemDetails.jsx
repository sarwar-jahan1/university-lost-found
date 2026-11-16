



import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ClaimForm from "../components/ClaimForm";

const sampleItems = [
  {
    id: "1",
    name: "Black Laptop Bag",
    category: "Bags",
    status: "Found",
    location: "CSE Building, Varendra University",
    date: "November 14, 2026",
    description:
      "A black laptop bag was found near the CSE department. It contains some books and a laptop charger.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    reporter: "University Student",
  },
  {
    id: "2",
    name: "Water Bottle",
    category: "Accessories",
    status: "Lost",
    location: "University Library",
    date: "November 13, 2026",
    description:
      "A blue water bottle was lost inside the university library.",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    reporter: "University Student",
  },
];

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showClaimForm, setShowClaimForm] = useState(false);

  const item = sampleItems.find((item) => item.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Item Not Found
        </h2>

        <p className="mt-2 text-slate-500">
          The requested item does not exist.
        </p>

        <button
          onClick={() => navigate("/items")}
          className="mt-5 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Back to Items
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/items")}
          className="mb-6 flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-900"
        >
          ← Back to Items
        </button>

        {/* Item Details Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Item Image */}
            <div className="h-72 bg-slate-100 md:h-full">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Item Information */}
            <div className="p-6 sm:p-8">

              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
                  {item.category}
                </span>

                <span
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                    item.status === "Found"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                {item.name}
              </h1>

              {/* Item Information */}
              <div className="mt-7 space-y-5">

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Location
                  </p>
                  <p className="mt-1 text-slate-800">
                    📍 {item.location}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Date
                  </p>
                  <p className="mt-1 text-slate-800">
                    📅 {item.date}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Reported By
                  </p>
                  <p className="mt-1 text-slate-800">
                    {item.reporter}
                  </p>
                </div>

              </div>

              {/* Description */}
              <div className="mt-7 border-t border-slate-200 pt-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Item Description
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>

              {/* Claim Button */}
              <button
                onClick={() => setShowClaimForm(true)}
                className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-blue-700"
              >
                Claim This Item →
              </button>

            </div>
          </div>
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
  );
};

export default ItemDetails;
