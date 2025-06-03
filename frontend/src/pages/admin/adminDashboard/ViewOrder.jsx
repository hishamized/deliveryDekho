import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admins/getOrder/${id}`, 
          { withCredentials: true } 
        );
        setOrder(response.data.order);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details.");
      }
    };

    fetchOrder();
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order) return <div className="text-center py-5">Loading order...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📦 Order Details</h2>

      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          Basic Information
        </div>
        <div className="card-body">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Unique ID:</strong> {order.unique_id}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`badge bg-${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </p>
          <p>
            <strong>Payment Status:</strong> {order.payment_status}
          </p>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header bg-info text-white">Contact Details</div>
        <div className="card-body">
          <p>
            <strong>Sender Phone:</strong> {order.phone_sender}
          </p>
          <p>
            <strong>Receiver Phone:</strong> {order.phone_receiver}
          </p>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header bg-success text-white">Addresses</div>
        <div className="card-body">
          <p>
            <strong>Source Address:</strong> {order.source_address}
          </p>
          <p>
            <strong>Destination Address:</strong> {order.dest_address}
          </p>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header bg-warning text-dark">Timing</div>
        <div className="card-body">
          <p>
            <strong>Customer Deadline:</strong>{" "}
            {new Date(order.customer_deadline).toLocaleString()}
          </p>
          <p>
            <strong>Assigned Time:</strong>{" "}
            {order.assigned_time
              ? new Date(order.assigned_time).toLocaleString()
              : "Not Assigned"}
          </p>
          <p>
            <strong>Pickup Time:</strong>{" "}
            {order.pickup_time
              ? new Date(order.pickup_time).toLocaleString()
              : "Not Picked"}
          </p>
          <p>
            <strong>Delivery Time:</strong>{" "}
            {order.delivery_time
              ? new Date(order.delivery_time).toLocaleString()
              : "Not Delivered"}
          </p>
        </div>
      </div>
      {order.deadlines && order.deadlines.length > 0 && (
        <div className="card shadow mb-4">
          <div className="card-header bg-dark text-white">Deadline History</div>
          <div className="card-body table-responsive">
            <table className="table table-bordered table-sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Deadline Type</th>
                  <th>Status</th>
                  <th>Expires At</th>
                </tr>
              </thead>
              <tbody>
                {order.deadlines.map((deadline, index) => (
                  <tr key={deadline.id}>
                    <td>{index + 1}</td>
                    <td>{deadline.deadline_type}</td>
                    <td>{deadline.status}</td>
                    <td>
                      {new Date(deadline.deadline_expire_time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for status badge colors
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

export default ViewOrder;
