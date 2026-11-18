
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import ReportItem from "./pages/ReportItem";
import TrackClaim from "./pages/TrackClaim";
import Profile from "./pages/Profile";
import ManageClaims from "./pages/ManageClaims";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Routes>
      {/* Landing / authentication page without sidebar */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/signup" element={<Navigate to="/auth" replace />} />

      {/* All application pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />

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

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/profile" element={<Profile />} />

          {/* 404 (signed-in users) */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
