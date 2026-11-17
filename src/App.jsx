
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

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
      <Route element={<MainLayout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Authentication */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* Items */}
        <Route path="/items" element={<Items />} />
        <Route path="/browse-items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetails />} />

        {/* Report */}
        <Route path="/report-item" element={<ReportItem />} />

        {/* Claims */}
        <Route path="/track-claims" element={<TrackClaim />} />
        <Route path="/track-claim" element={<TrackClaim />} />
        <Route
          path="/manage-claims/:itemId"
          element={<ManageClaims />}
        />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900">
                  404
                </h1>
                <p className="mt-2 text-slate-600">
                  Page not found.
                </p>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
