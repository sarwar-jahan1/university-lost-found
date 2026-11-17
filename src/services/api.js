
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "campus_access_token";

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const saveAccessToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const apiRequest = async (endpoint, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error("Backend URL is not configured. Check your .env file.");
  }

  const token = getAccessToken();

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL.replace(/\/+$/, "")}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  } catch {
    throw new Error(
      "Cannot connect to backend. Check your internet connection."
    );
  }

  const responseText = await response.text();

  let data = null;

  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.message || data.error || data.detail
        : data;

    if (response.status === 401) {
      throw new Error("Session expired or invalid. Please Sign In again.");
    }

    if (response.status === 403) {
      throw new Error("You are not authorized to perform this action.");
    }

    throw new Error(
      message || `Request failed with status ${response.status}`
    );
  }

  return data;
};
