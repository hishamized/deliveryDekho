// src/pages/admin/adminDashboard/AdminDashboard.jsx
import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

   useEffect(() => {
    const checkRiderSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/riders/check-session", {
          withCredentials: true,
        });
        if (!response.data.isAuthenticated) {
          navigate("/rider/RiderLogin");
        } 
      } catch (error) {
        console.error("Session check failed:", error);
        alert("There was an error checking your session. Please log in again.");
        navigate("/rider/RiderLogin");
      }
    };

    checkRiderSession();
  }, [navigate]); 

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/riders/logout",
        {},
        { withCredentials: true }
      );
      navigate("/rider/RiderLogin");
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
        <h4 className="mb-4">Rider Dashboard</h4>
        <button className="btn btn-danger mb-3 w-100" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="btn btn-success mb-2 w-100"
          onClick={() => navigate("/rider/RiderDashboard/assignments")}
        >
          My Assignments
        </button>

      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4 w-100 h-100">
        <Outlet />
      </div>
    </div>
  );
}
