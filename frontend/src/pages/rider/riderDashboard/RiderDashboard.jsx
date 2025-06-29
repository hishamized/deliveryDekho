// src/pages/rider/riderDashboard/RiderDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
 const baseUrl = import.meta.env.VITE_API_BASE_URL;
export default function RiderDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkRiderSession = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/riders/check-session`, {
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
      await axios.post(`${baseUrl}/api/riders/logout`, {}, { withCredentials: true });
      navigate("/rider/RiderLogin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false); // Auto-close sidebar on mobile
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-2 left-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded"
        onClick={() => setSidebarOpen(true)}
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static z-50 bg-white w-64 h-full p-4 transition-transform transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 shadow md:shadow-none`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-semibold">Rider Dashboard</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="hidden md:block mb-6">
          <h2 className="text-xl font-semibold">Rider Dashboard</h2>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={() => handleNavigate("/rider/RiderDashboard/assignments")}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            My Assignments
          </button>
          <button
            onClick={() => handleNavigate("/rider/RiderDashboard/riderDashboardPanel")}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            My Control Panel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto  bg-gray-50 ml-0 md:ml-4">
        <Outlet />
      </div>
    </div>
  );
}
