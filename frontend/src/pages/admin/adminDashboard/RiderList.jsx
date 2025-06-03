import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RiderList() {
  const [riders, setRiders] = useState([]);
  const navigate = useNavigate();

  // Fetch riders from backend on component mount
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admins/riders', { withCredentials: true });
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
      const response = await axios.delete(`http://localhost:5000/api/admins/delete-rider/${id}`, { withCredentials: true });
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
    <div className="container mt-4">
      <h2 className="text-success mb-4">Rider List</h2>

      {/* Responsive wrapper */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-success text-nowrap">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>License</th>
              <th>Vehicle Reg.</th>
              <th>Status</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.length > 0 ? (
              riders.map(rider => (
                <tr key={rider.id}>
                  <td>{rider.id}</td>
                  <td>{rider.name}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.email || '—'}</td>
                  <td>{rider.driver_license_number}</td>
                  <td>{rider.vehicle_registration_number}</td>
                  <td>{rider.availability_status ? 'Available' : 'Unavailable'}</td>
                  <td>{rider.is_active ? 'Yes' : 'No'}</td>
                  <td className="text-nowrap">
                    <button
                      className="btn btn-sm btn-info me-2 mb-1"
                      onClick={() => navigate(`/riders/view/${rider.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2 mb-1"
                      onClick={() => navigate(`/riders/edit/${rider.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger mb-1"
                      onClick={() => handleDelete(rider.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No riders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
