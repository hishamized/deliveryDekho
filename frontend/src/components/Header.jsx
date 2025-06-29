import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
 const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Header = ({ admin, rider, setAdmin, setRider }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (admin) {
        await axios.post(`${baseUrl}/api/admins/logout`, {}, { withCredentials: true });
        setAdmin(null);
      } else if (rider) {
        await axios.post(`${baseUrl}/api/riders/logout`, {}, { withCredentials: true });
        setRider(null);
      }
      navigate("/");
    } catch (err) {
      console.error("Logout failed" + err);
    }
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-semibold">Delivery Dekho</Link>
        <ul className="flex items-center space-x-4">
          {(() => {
            if (admin) {
              return (
                <li>
                  <button onClick={handleLogout} className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 transition">
                    Logout ({admin.name})
                  </button>
                </li>
              );
            } else if (rider) {
              return (
                <li>
                  <button onClick={handleLogout} className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-600 transition">
                    Logout ({rider.name})
                  </button>
                </li>
              );
            } else {
              return (
                <>
                  <li>
                    <Link to="/admin/AdminDashboard" className="hover:text-gray-300 transition">
                      Admin
                    </Link>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate("/rider/RiderDashboard"); }} className="hover:text-gray-300 transition">
                      Rider
                    </a>
                  </li>
                </>
              );
            }
          })()}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
