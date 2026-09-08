import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Marketplace from "./pages/Marketplace";
import OrgDashboard from "./pages/OrgDashboard";
import AdminApproval from "./pages/AdminApproval";
import Certificate from "./pages/Certificate";
import Signup from "./pages/Signup";
import ListingDetails from "./pages/ListingDetails";

import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>

        {/* MAIN CARBONX WEBSITE */}
        <Route path="/" element={<Home />} />

        {/* LOGIN / SIGNUP */}
        <Route path="/login" element={<Login />} />

        {/* BUYER MARKETPLACE */}
        <Route path="/marketplace" element={<Marketplace />} />

        {/* ORGANIZATION DASHBOARD */}
        <Route path="/dashboard" element={<OrgDashboard />} />

        {/* ADMIN APPROVAL */}
        <Route path="/admin" element={<AdminApproval />} />

        {/* BUYER CERTIFICATE */}
        <Route path="/certificate" element={<Certificate />} />

        {/* SIGNUP */}
        <Route path="/signup" element={<Signup />} />

        {/* LISTING DETAILS */}
        <Route
          path="/listing/:id"
          element={<ListingDetails />}
        />

      </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}