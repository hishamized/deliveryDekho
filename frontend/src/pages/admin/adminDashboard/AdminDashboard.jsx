// src/pages/admin/adminDashboard/AdminDashboard.jsx
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

   useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admins/check-session", {
          withCredentials: true,
        });
        if (!response.data.loggedIn) {
          navigate("/admin/AdminLogin");
        } 
      } catch (error) {
        console.error("Session check failed:", error);
        alert("There was an error checking your session. Please log in again.");
        navigate("/rider/RiderLogin");
      }
    };

    checkAdminSession();
  }, [navigate]); 

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admins/logout",
        {},
        { withCredentials: true }
      );
      navigate("/admin/AdminLogin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row w-100">
      {/* Sidebar */}
      <div
        className="bg-light p-3"
        style={{ minWidth: "250px", maxWidth: "250px" }}
      >
        <h4 className="mb-4">Admin Dashboard</h4>
        <button className="btn btn-danger mb-3 w-100" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="btn btn-success mb-2 w-100"
          onClick={() => navigate("/admin/AdminDashboard/register")}
        >
          Register New Admin
        </button>
        <button
          className="btn btn-success mb-2 w-100"
          onClick={() => navigate("/admin/AdminDashboard/change-password")}
        >
          Change Password
        </button>
        <button
          className="btn btn-success mb-2 w-100"
          onClick={() => navigate("/admin/AdminDashboard/add-rider")}
        >
          Add Rider
        </button>
        <button
          className="btn btn-success mb-2 w-100"
          onClick={() => navigate("/admin/AdminDashboard/rider-list")}
        >
          Rider List
        </button>
        <button
          className="btn btn-success mb-2 w-100"
          onClick={() => navigate("/admin/AdminDashboard/place-order")}
        >
          Place Order
        </button>
        <button
          className="btn btn-success mb-2 w-100"
          onClick={() => navigate("/admin/AdminDashboard/order-list")}
        >
          Order List
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4 w-100 h-100">
        <Outlet />
      </div>
    </div>
  );
}
