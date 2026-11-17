
import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import ReportItem from "./pages/ReportItem";
import TrackClaim from "./pages/TrackClaim";

import MainLayout from "./layouts/MainLayout";

import { isAuthenticated } from "./services/authService";

const ProtectedLayout = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <MainLayout />;
};

const PublicRoute = () => {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return <Auth />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/report-item" element={<ReportItem />} />
        <Route path="/track-claim" element={<TrackClaim />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
