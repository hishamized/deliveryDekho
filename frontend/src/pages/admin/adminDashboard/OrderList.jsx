import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDeleteOrder = async (orderId) => {
    try {
      const result = await axios.delete(
        `http://localhost:5000/api/admins/deleteOrder/${orderId}`,
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
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admins/getOrders", 
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
    <div className="container-fluid mt-4">
      <h2 className="mb-4">📦 Order List</h2>
      <div
        className="table-responsive"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <table className="table table-hover table-bordered table-striped align-middle text-center">
          <thead className="table-dark sticky-top">
            <tr>
              {/* <th className="text-nowrap">ID</th> */}
              <th className="text-nowrap">Unique ID</th>
              <th className="text-nowrap">Status</th>
              <th className="text-nowrap">Sender Phone</th>
              <th className="text-nowrap">Receiver Phone</th>
              <th className="text-nowrap">Source Address</th>
              <th className="text-nowrap">Destination Address</th>
              <th className="text-nowrap">Deadline</th>
              <th className="text-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
                <tr>
                    <td colSpan="8" className="text-center text-muted">
                        No orders found.
                    </td>
                </tr>
            ) : null}
            {orders.map((order) => (
              <tr key={order.id}>
                {/* <td>{order.id}</td> */}
                <td>{order.unique_id}</td>
                <td>
                  <span className={`badge bg-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.phone_sender}</td>
                <td>{order.phone_receiver}</td>
                <td className="text-break">{order.source_address}</td>
                <td className="text-break">{order.dest_address}</td>
                <td>{new Date(order.customer_deadline).toLocaleString()}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        navigate(`/admin/AdminDashboard/view-order/${order.id}`)
                      }
                    >
                      View
                    </button>
                    <button className="btn btn-sm btn-warning"
                    onClick={() => navigate(`/admin/AdminDashboard/edit-order/${order.id}`)}
                    >Edit</button>
                    <button
                      className="btn btn-sm btn-danger"
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
      return "secondary";
    case "assigned":
      return "info";
    case "picked":
      return "primary";
    case "delivered":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "dark";
  }
};

export default OrderList;
