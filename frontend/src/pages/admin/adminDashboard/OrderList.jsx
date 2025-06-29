import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
const OrderList = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteOrder = async (orderId) => {
    try {
      const result = await axios.delete(
        `${baseUrl}/api/admins/deleteOrder/${orderId}`,
        { withCredentials: true }
      );
      if (result.status !== 200) {
        throw new Error("Failed to delete order");
      } else {
        setOrders(orders.filter((order) => order.id !== orderId));
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
      setError("Failed to delete order.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/admins/getOrders`,
          { withCredentials: true }
        );
        setOrders(response.data.orders); // NOTE: response.data.orders not just response.data
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-5">Loading orders...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="w-full px-4 mt-6">
      <h2 className="text-2xl font-semibold mb-6">📦 Order List</h2>

      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="sticky top-0 bg-gray-800 text-white text-center text-xs uppercase tracking-wider">
            <tr>
              {/* <th className="px-4 py-2 border">ID</th> */}
              <th className="px-4 py-2 border whitespace-nowrap">Unique ID</th>
              <th className="px-4 py-2 border whitespace-nowrap">Status</th>
              <th className="px-4 py-2 border whitespace-nowrap">
                Sender Phone
              </th>
              <th className="px-4 py-2 border whitespace-nowrap">
                Receiver Phone
              </th>
              <th className="px-4 py-2 border whitespace-nowrap">
                Source Address
              </th>
              <th className="px-4 py-2 border whitespace-nowrap">
                Destination Address
              </th>
              <th className="px-4 py-2 border whitespace-nowrap">Deadline</th>
              <th className="px-4 py-2 border whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : null}

            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                {/* <td className="px-4 py-2 border">{order.id}</td> */}
                <td className="px-4 py-2 border">{order.unique_id}</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 border">{order.phone_sender}</td>
                <td className="px-4 py-2 border">{order.phone_receiver}</td>
                <td className="px-4 py-2 border text-left break-words">
                  {order.source_address}
                </td>
                <td className="px-4 py-2 border text-left break-words">
                  {order.dest_address}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(order.customer_deadline).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex justify-center gap-2 flex-wrap">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/AdminDashboard/view-order/${order.id}`)
                      }
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/admin/AdminDashboard/edit-order/${order.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this order?"
                          )
                        ) {
                          handleDeleteOrder(order.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper for status badge color
const getStatusColor = (status) => {
  switch (status) {
    case "registered":
      return "bg-gray-500 text-white";
    case "assigned":
      return "bg-blue-400 text-white";
    case "picked":
      return "bg-indigo-500 text-white";
    case "delivered":
      return "bg-green-500 text-white";
    case "cancelled":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-700 text-white";
  }
};

export default OrderList;
