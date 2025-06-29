import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
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
    .get(`${baseUrl}/api/admins/getOrder/${id}`, { withCredentials: true })
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
      .put(`${baseUrl}/api/admins/updateOrder/${id}`, order, { withCredentials: true })
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
  <div className="max-w-3xl mx-auto mt-10 px-4">
    <h2 className="text-2xl font-semibold mb-6">
      Edit Order {order.unique_id ? order.unique_id : id}
    </h2>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium mb-1">Source Address</label>
        <textarea
          name="source_address"
          value={order.source_address}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Destination Address</label>
        <textarea
          name="dest_address"
          value={order.dest_address}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Sender Phone</label>
        <input
          type="text"
          name="phone_sender"
          value={order.phone_sender}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Receiver Phone</label>
        <input
          type="text"
          name="phone_receiver"
          value={order.phone_receiver}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          name="status"
          value={order.status}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="registered">Registered</option>
          <option value="assigned">Assigned</option>
          <option value="picked">Picked</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Payment Status</label>
        <select
          name="payment_status"
          value={order.payment_status}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
      >
        Update Order
      </button>
    </form>
  </div>
);

};

export default EditOrder;
