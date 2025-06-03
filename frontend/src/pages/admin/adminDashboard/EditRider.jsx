import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        const response = await axios.get(`http://localhost:5000/api/admins/rider/${id}`, { withCredentials: true });
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
      await axios.put(`http://localhost:5000/api/admins/rider/${id}`, formData);
      alert('Rider updated successfully');
      navigate('/admin/RiderList');
    } catch (error) {
      console.error('Error updating rider:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Edit Rider</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input name="phone" value={formData.phone} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" value={formData.email || ''} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Driver License Number</label>
          <input name="driver_license_number" value={formData.driver_license_number} onChange={handleChange} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Vehicle Registration Number</label>
          <input name="vehicle_registration_number" value={formData.vehicle_registration_number} onChange={handleChange} className="form-control" />
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="availability_status" checked={formData.availability_status} onChange={handleChange} />
          <label className="form-check-label">Available</label>
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
          <label className="form-check-label">Active</label>
        </div>
        <button type="submit" className="btn btn-success">Update Rider</button>
      </form>
    </div>
  );
}
