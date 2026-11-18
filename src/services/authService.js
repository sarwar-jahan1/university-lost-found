
import {
  apiRequest,
  saveAccessToken,
  removeAccessToken,
  getAccessToken,
  USER_KEY,
} from "./api";

// The API documents the profile route WITHOUT a trailing slash
// (`/api/user/me`); fall back to the slash form for other builds.
const requestProfile = async () => {
  try {
    return await apiRequest("/api/user/me");
  } catch (err) {
    if (/session expired|cannot connect/i.test(err.message || "")) {
      throw err;
    }

    return apiRequest("/api/user/me/");
  }
};

// Register a new account
export const signupUser = async ({ name, email, password }) => {
  return apiRequest("/api/auth/signup/", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

// Login
export const loginUser = async ({ email, password }) => {
  const data = await apiRequest("/api/auth/signin/", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!data || !data.accessToken) {
    throw new Error("Sign In response did not contain an access token.");
  }

  saveAccessToken(data.accessToken);

  try {
    const user = await requestProfile();

    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  } catch {
    // Keep the received token if the profile endpoint fails.
    const fallbackUser = { email };

    localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));

    return fallbackUser;
  }
};

// Get current user
export const getCurrentUser = () => {
  if (!getAccessToken()) {
    return null;
  }

  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Check authentication
export const isAuthenticated = () => {
  return Boolean(getAccessToken());
};

// Logout
export const logoutUser = () => {
  removeAccessToken();
  localStorage.removeItem(USER_KEY);
};

// Fetch current user profile
export const fetchCurrentUser = async () => {
  const user = await requestProfile();

  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return user;
};
