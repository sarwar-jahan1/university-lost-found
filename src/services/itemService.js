
import { apiRequest } from "./api";

// PUT /api/items/{id}/  (reporter only, JSON body, image is not replaced)
export const updateItem = async (id, { title, description, type, location, eventDate }) => {
  if (!id) throw new Error("Item ID is required.");

  return apiRequest(`/api/items/${id}/`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      description,
      type,
      location,
      eventDate,
    }),
  });
};

// DELETE /api/items/{id}/  (reporter only, returns 204)
export const deleteItem = async (id) => {
  if (!id) throw new Error("Item ID is required.");

  return apiRequest(`/api/items/${id}/`, { method: "DELETE" });
};
