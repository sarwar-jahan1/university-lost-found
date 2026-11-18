
const BASE_URL = "http://localhost:8080";

// This key must match the key used by your login integration.
const TOKEN_KEY = "campus_access_token";

// Common request function
const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const headers = {
        Accept: "application/json",
        ...options.headers,
    };

    if (options.body) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        throw new Error(
            data?.message || `API Error: ${response.status}`
        );
    }

    return data;
};

// Get all item reports
export const getReports = async () => {
    return await apiRequest("/api/items/");
};

// Create a new item report
export const createReport = async (reportData) => {
    return await apiRequest("/api/items/", {
        method: "POST",
        body: JSON.stringify(reportData),
    });
};

// Delete an item report
export const deleteReport = async (id) => {
    return await apiRequest(`/api/items/${id}/`, {
        method: "DELETE",
    });
};
