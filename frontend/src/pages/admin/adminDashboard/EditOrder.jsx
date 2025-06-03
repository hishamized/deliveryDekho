import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditOrder = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    source_address: '',
    dest_address: '',
    phone_sender: '',
    phone_receiver: '',
    status: 'registered',
    payment_status: 'no',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch existing order
  useEffect(() => {
  axios
    .get(`http://localhost:5000/api/admins/getOrder/${id}`, { withCredentials: true })
    .then((response) => {
      if (response.data.success) {
        const data = response.data.order;
        setOrder({
            unique_id: data.unique_id || '',
          id: data.id || '',
          source_address: data.source_address || '',
          dest_address: data.dest_address || '',
          phone_sender: data.phone_sender || '',
          phone_receiver: data.phone_receiver || '',
          status: data.status || 'registered',
          payment_status: data.payment_status || 'no',
        });
      } else {
        setError('Order not found');
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError('Failed to fetch order');
      setLoading(false);
    });
}, [id]);


  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/api/admins/updateOrder/${id}`, order, { withCredentials: true })
      .then(() => {
        alert('Order updated successfully!');
        // navigate('/admin/AdminDashboard'); 
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to update order');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Edit Order {order.unique_id ? order.unique_id : id}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Source Address</label>
          <textarea
            className="form-control"
            name="source_address"
            value={order.source_address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Destination Address</label>
          <textarea
            className="form-control"
            name="dest_address"
            value={order.dest_address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Sender Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone_sender"
            value={order.phone_sender}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Receiver Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone_receiver"
            value={order.phone_receiver}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={order.status}
            onChange={handleChange}
            required
          >
            <option value="registered">Registered</option>
            <option value="assigned">Assigned</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Payment Status</label>
          <select
            className="form-select"
            name="payment_status"
            value={order.payment_status}
            onChange={handleChange}
            required
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Update Order</button>
      </form>
    </div>
  );
};

export default EditOrder;
