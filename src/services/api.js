
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY = "campus_access_token";
export const USER_KEY = "campus_user";

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const saveAccessToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Pull a readable message out of whatever error shape the backend sends
// (message / error / detail, a list of errors, or field -> [messages]).
const extractMessage = (data) => {
  if (!data) return "";

  if (typeof data === "string") {
    const text = data.trim();
    return text && text.length < 300 && !text.startsWith("<") ? text : "";
  }

  if (typeof data !== "object") return "";

  for (const key of ["message", "detail", "error"]) {
    if (typeof data[key] === "string" && data[key].trim()) {
      return data[key];
    }
  }

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    if (typeof first === "string") return first;
    return first?.message || first?.defaultMessage || "";
  }

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    if (typeof value === "string" && value.trim()) return value;
  }

  return "";
};

export const apiRequest = async (endpoint, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error("Backend URL is not configured. Check your .env file.");
  }

  const token = getAccessToken();
  const isAuthEndpoint = endpoint.startsWith("/api/auth/");

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
    const message = extractMessage(data);

    // Wrong email / password on the Sign In / Sign Up forms is not an
    // expired session, so keep the backend's own message there.
    if (
      isAuthEndpoint &&
      (response.status === 401 || response.status === 403)
    ) {
      throw new Error(message || "Invalid email or password.");
    }

    // A real expired / invalid token: clear it and send the user to Sign In.
    if (response.status === 401) {
      removeAccessToken();
      localStorage.removeItem(USER_KEY);

      if (token && window.location.pathname !== "/auth") {
        window.location.replace("/auth");
      }

      throw new Error("Session expired. Please Sign In again.");
    }

    // 403 / 409 / 400 usually carry the real reason
    // (e.g. "You cannot claim your own item"), so show it.
    if (response.status === 403) {
      throw new Error(message || "You are not authorized to perform this action.");
    }

    throw new Error(
      message || `Request failed with status ${response.status}`
    );
  }

  return data;
};
