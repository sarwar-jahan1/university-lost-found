
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";

import Home from "./pages/Home";
import Items from "./pages/Items";
import ReportItem from "./pages/ReportItem";
import ItemDetails from "./pages/ItemDetails";
import TrackClaim from "./pages/TrackClaim";

import { getCurrentUser } from "./services/authService";

// Protect the main website pages
const ProtectedLayout = () => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <MainLayout />;
};

function App() {
  const user = getCurrentUser();

  return (
    <Routes>

      {/* Login / Sign Up */}
      <Route
        path="/"
        element={
          user
            ? <Navigate to="/home" replace />
            : <Auth />
        }
      />

      {/* Protected Website Pages */}
      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route path="/report-item" element={<ReportItem />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/track-claim" element={<TrackClaim />} />
      </Route>

      {/* Unknown URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;
