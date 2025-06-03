// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./app.css";

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

// Rider Imports
import RiderLogin from "./pages/rider/RiderLogin";
import RiderDashboard from "./pages/rider/riderDashboard/RiderDashboard";
import RiderAssignments from "./pages/rider/riderDashboard/RiderAssignments";

import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-fill">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/AdminLogin" element={<AdminLogin />} />
            <Route path="/rider/RiderLogin" element={<RiderLogin />} />

            {/* Admin routes nested inside AdminDashboard */}
            <Route path="/admin/AdminDashboard" element={<AdminDashboard />}>
              <Route path="register" element={<RegisterAdminForm />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="add-rider" element={<AddRider />} />
              <Route path="rider-list" element={<RiderList />} />
              <Route path="place-order" element={<PlaceOrder />} />
              <Route path="order-list" element={<OrderList />} />
              <Route path="view-order/:id" element={<ViewOrder />} />
              <Route path="edit-order/:id" element={<EditOrder />} />
            </Route>

            {/* Rider edit/view routes (outside admin layout) */}
            <Route path="/riders/edit/:id" element={<EditRider />} />
            <Route path="/riders/view/:id" element={<ViewRider />} />

            {/* Rider routes nested inside RiderDashboard */}
            <Route path="/rider/RiderDashboard" element={<RiderDashboard />}>
              <Route path="assignments" element={<RiderAssignments />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
