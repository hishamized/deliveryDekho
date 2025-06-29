// src/App.jsx
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.css";
 const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Admin Imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/adminDashboard/AdminDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisterAdminForm from "./pages/admin/adminDashboard/RegisterAdminForm";
import ChangePassword from "./pages/admin/adminDashboard/ChangePassword";
import AddRider from "./pages/admin/adminDashboard/AddRider";
import RiderList from "./pages/admin/adminDashboard/RiderList";
import EditRider from "./pages/admin/adminDashboard/EditRider";
import ViewRider from "./pages/admin/adminDashboard/ViewRider";
import PlaceOrder from "./pages/admin/adminDashboard/PlaceOrder";
import OrderList from "./pages/admin/adminDashboard/OrderList";
import ViewOrder from "./pages/admin/adminDashboard/ViewOrder";
import EditOrder from "./pages/admin/adminDashboard/EditOrder";
import Deadlines from "./pages/admin/adminDashboard/Deadlines";
import AdminControlPanel from "./pages/admin/adminDashboard/AdminControlPanel";

// Rider Imports
import RiderLogin from "./pages/rider/RiderLogin";
import RiderDashboard from "./pages/rider/riderDashboard/RiderDashboard";
import RiderAssignments from "./pages/rider/riderDashboard/RiderAssignments";
import ViewAssignment from "./pages/rider/riderDashboard/ViewAssignment";
import RiderControlPanel from "./pages/rider/riderDashboard/RiderControlPanel";

import HomePage from "./pages/HomePage";

const App = () => {
   const [admin, setAdmin] = useState(null);
  const [rider, setRider] = useState(null);
  
  useEffect(() => {
    const checkSessions = async () => {
      try {
        const adminRes = await axios.get(`${baseUrl}/api/admins/check-session`, { withCredentials: true });
        if (adminRes.data.loggedIn) setAdmin(adminRes.data.admin);

        const riderRes = await axios.get(`${baseUrl}/api/riders/check-session`, { withCredentials: true });
        if (riderRes.data.isAuthenticated) setRider(riderRes.data.rider);
      } catch (err) {
        console.error("Session check failed" + err);
      }
    };
    checkSessions();
  }, []);
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header admin={admin} setAdmin={setAdmin} rider={rider} setRider={setRider} />
        <main className="flex-fill">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/AdminLogin" element={<AdminLogin setAdmin={setAdmin} />} />
            <Route path="/rider/RiderLogin" element={<RiderLogin setRider={setRider} />} />

            {/* Admin routes nested inside AdminDashboard */}
            <Route path="/admin/AdminDashboard" element={<AdminDashboard />}>
              <Route index element={<AdminControlPanel />} />
              <Route path="adminControlPanel" element={<AdminControlPanel />} />
              <Route path="register" element={<RegisterAdminForm />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="add-rider" element={<AddRider />} />
              <Route path="rider-list" element={<RiderList />} />
              <Route path="place-order" element={<PlaceOrder />} />
              <Route path="order-list" element={<OrderList />} />
              <Route path="view-order/:id" element={<ViewOrder />} />
              <Route path="edit-order/:id" element={<EditOrder />} />
              <Route path="deadlines" element={<Deadlines />} />
               <Route path="riders/edit/:id" element={<EditRider />} />
               <Route path="riders/view/:id" element={<ViewRider />} />
            </Route>

            {/* Rider routes nested inside RiderDashboard */}
            <Route path="/rider/RiderDashboard" element={<RiderDashboard />}>
              <Route index element={<RiderControlPanel />} />
              <Route path="assignments" element={<RiderAssignments />} />
              <Route path="riderDashboardPanel" element={<RiderControlPanel />} />
              <Route path="viewAssignment/:id" element={<ViewAssignment />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
