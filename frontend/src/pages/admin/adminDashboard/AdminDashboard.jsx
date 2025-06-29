// src/pages/admin/adminDashboard/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
// import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
  const baseURL = import.meta.env.VITE_API_BASE_URL;
export default function AdminDashboard() {
  
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/admins/check-session`,
          { withCredentials: true }
        );
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
        `${baseURL}/api/admins/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/admin/AdminLogin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false); // Hide sidebar on mobile after click
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-2 left-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded"
        onClick={() => setSidebarOpen(true)}
      >
        <i class="fa-solid fa-bars"></i>
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
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <button onClick={() => setSidebarOpen(false)}>
           <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="hidden md:block mb-6">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={() => handleNavigate("/admin/AdminDashboard/adminControlPanel")}
            className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Admin Control Panel
          </button>
          <button onClick={() => handleNavigate("/admin/AdminDashboard/register")} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Register New Admin
          </button>
          <button onClick={() => handleNavigate("/admin/AdminDashboard/change-password")} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Change Password
          </button>
          <button onClick={() => handleNavigate("/admin/AdminDashboard/add-rider")} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Add Rider
          </button>
          <button onClick={() => handleNavigate("/admin/AdminDashboard/rider-list")} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Rider List
          </button>
          <button onClick={() => handleNavigate("/admin/AdminDashboard/place-order")} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Place Order
          </button>
          <button onClick={() => handleNavigate("/admin/AdminDashboard/order-list")} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Order List
          </button>
          <button onClick={() => handleNavigate("/admin/AdminDashboard/deadlines")} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Deadlines
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 ml-0 md:ml-4">
        <Outlet />
      </div>
    </div>
  );
}
