import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_BASE_URL;
export default function EditRider() {
    
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    driver_license_number: '',
    vehicle_registration_number: '',
    availability_status: false,
    is_active: false,
  });

  useEffect(() => {
    const fetchRider = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/admins/rider/${id}`, { withCredentials: true });
        setFormData(response.data.rider);
      } catch (error) {
        console.error('Error fetching rider:', error);
      }
    };
    fetchRider();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/api/admins/rider/${id}`, formData);
      alert('Rider updated successfully');
      navigate('/admin/RiderList');
    } catch (error) {
      console.error('Error updating rider:', error);
    }
  };

return (
  <div className="max-w-3xl mx-auto mt-6 px-4">
    <h2 className="text-2xl font-semibold text-blue-600 mb-6">Edit Rider</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Driver License Number</label>
        <input
          name="driver_license_number"
          value={formData.driver_license_number}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Vehicle Registration Number</label>
        <input
          name="vehicle_registration_number"
          value={formData.vehicle_registration_number}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="availability_status"
          checked={formData.availability_status}
          onChange={handleChange}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label className="ml-2 text-sm">Available</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label className="ml-2 text-sm">Active</label>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
      >
        Update Rider
      </button>
    </form>
  </div>
);

}
