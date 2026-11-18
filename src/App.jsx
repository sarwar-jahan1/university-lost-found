
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import ReportItem from "./pages/ReportItem";
import TrackClaim from "./pages/TrackClaim";
import Profile from "./pages/Profile";
import ManageClaims from "./pages/ManageClaims";

function App() {
  return (
    <Routes>
      {/* Authentication page without Navbar */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/signup" element={<Navigate to="/auth" replace />} />

      {/* All application pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />

          <Route path="/items" element={<Items />} />
          <Route path="/browse-items" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetails />} />

          <Route path="/report-item" element={<ReportItem />} />

          <Route path="/track-claims" element={<TrackClaim />} />
          <Route path="/track-claim" element={<TrackClaim />} />

          <Route
            path="/manage-claims/:itemId"
            element={<ManageClaims />}
          />

          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<Navigate to="/auth" replace />}
      />
    </Routes>
  );
}

export default App;
