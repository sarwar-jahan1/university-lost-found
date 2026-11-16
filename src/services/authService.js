
const AUTH_KEY = "campus_demo_user";

// Demo Sign In
export const loginUser = async (email, password) => {
  if (!email.trim() || !password.trim()) {
    throw new Error("Please enter email and password.");
  }

  const user = {
    email: email.trim(),
    name: email.split("@")[0],
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  return user;
};

// Demo Sign Up
export const registerUser = async (name, email, password) => {
  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error("Please fill in all fields.");
  }

  const user = {
    name: name.trim(),
    email: email.trim(),
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));

  return user;
};

// Get Current User
export const getCurrentUser = () => {
  const user = localStorage.getItem(AUTH_KEY);
  return user ? JSON.parse(user) : null;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
};
