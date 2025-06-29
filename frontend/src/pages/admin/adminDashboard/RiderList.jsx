import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 const baseUrl = import.meta.env.VITE_API_BASE_URL;
export default function RiderList() {
   
  const [riders, setRiders] = useState([]);
  const navigate = useNavigate();

  // Fetch riders from backend on component mount
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/admins/riders`, { withCredentials: true });
        setRiders(response.data.riders || []);
      } catch (err) {
        console.error('Error fetching riders:', err);
      }
    };
    fetchRiders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rider?')) return;
    try {
      const response = await axios.delete(`${baseUrl}/api/admins/delete-rider/${id}`, { withCredentials: true });
      if (response.data.success) {
        setRiders(riders.filter(r => r.id !== id));
      } else {
        console.error('Error deleting rider:', response.data.message);
      }
    } catch (err) {
      console.error('Error deleting rider:', err);
    }
  };

 return (
  <div className="max-w-7xl mx-auto px-4 mt-6">
    <h2 className="text-2xl font-semibold text-green-600 mb-6">Rider List</h2>

    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-green-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 border">ID</th>
            <th className="px-4 py-3 border">Name</th>
            <th className="px-4 py-3 border">Phone</th>
            <th className="px-4 py-3 border">Email</th>
            <th className="px-4 py-3 border">License</th>
            <th className="px-4 py-3 border">Vehicle Reg.</th>
            <th className="px-4 py-3 border">Status</th>
            <th className="px-4 py-3 border">Active</th>
            <th className="px-4 py-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {riders.length > 0 ? (
            riders.map((rider) => (
              <tr key={rider.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{rider.id}</td>
                <td className="px-4 py-2 border">{rider.name}</td>
                <td className="px-4 py-2 border">{rider.phone}</td>
                <td className="px-4 py-2 border">{rider.email || '—'}</td>
                <td className="px-4 py-2 border">{rider.driver_license_number}</td>
                <td className="px-4 py-2 border">{rider.vehicle_registration_number}</td>
                <td className="px-4 py-2 border">
                  {rider.availability_status ? 'Available' : 'Unavailable'}
                </td>
                <td className="px-4 py-2 border">{rider.is_active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 border whitespace-nowrap space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    onClick={() => navigate(`/admin/AdminDashboard/riders/view/${rider.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                    onClick={() => navigate(`/admin/AdminDashboard/riders/edit/${rider.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    onClick={() => handleDelete(rider.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center px-4 py-4 text-gray-500">
                No riders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

}
