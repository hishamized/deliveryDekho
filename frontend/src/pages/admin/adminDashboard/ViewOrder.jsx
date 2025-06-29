import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
 const baseUrl = import.meta.env.VITE_API_BASE_URL;
const ViewOrder = () => {
   
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/admins/getOrder/${id}`, 
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
  <div className="max-w-5xl mx-auto mt-6 px-4">
    <h2 className="text-2xl font-bold mb-6">📦 Order Details</h2>

    {/* Basic Information */}
    <div className="bg-white shadow-md rounded mb-6">
      <div className="bg-blue-600 text-white px-4 py-2 font-semibold rounded-t">
        Basic Information
      </div>
      <div className="p-4 space-y-2">
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Unique ID:</strong> {order.unique_id}</p>
        <p>
          <strong>Status:</strong>{" "}
         <span className={`inline-block px-2 py-1 text-white text-sm rounded ${getStatusColor(order.status)}`}>
  {order.status}
</span>
        </p>
        <p><strong>Payment Status:</strong> {order.payment_status}</p>
      </div>
    </div>

    {/* OTP Section */}
    <div className="bg-white shadow-md rounded mb-6">
      <div className="bg-red-600 text-white px-4 py-2 font-semibold rounded-t">
        One Time Passwords
      </div>
      <div className="p-4 space-y-2">
        <p><strong>Pickup OTP:</strong> {order.send_otp || "Not Available Yet"}</p>
        <p><strong>Delivery OTP:</strong> {order.deliver_otp || "Not Available Yet"}</p>
      </div>
    </div>

    {/* Contact Details */}
    <div className="bg-white shadow-md rounded mb-6">
      <div className="bg-cyan-600 text-white px-4 py-2 font-semibold rounded-t">
        Contact Details
      </div>
      <div className="p-4 space-y-2">
        <p><strong>Sender Phone:</strong> {order.phone_sender}</p>
        <p><strong>Receiver Phone:</strong> {order.phone_receiver}</p>
      </div>
    </div>

    {/* Addresses */}
    <div className="bg-white shadow-md rounded mb-6">
      <div className="bg-green-600 text-white px-4 py-2 font-semibold rounded-t">
        Addresses
      </div>
      <div className="p-4 space-y-2">
        <p><strong>Source Address:</strong> {order.source_address}</p>
        <p><strong>Destination Address:</strong> {order.dest_address}</p>
      </div>
    </div>

    {/* Timing Info */}
    <div className="bg-white shadow-md rounded mb-6">
      <div className="bg-yellow-400 text-black px-4 py-2 font-semibold rounded-t">
        Timing
      </div>
      <div className="p-4 space-y-2">
        <p><strong>Customer Deadline:</strong> {new Date(order.customer_deadline).toLocaleString()}</p>
        <p><strong>Assigned Time:</strong> {order.assigned_time ? new Date(order.assigned_time).toLocaleString() : "Not Assigned"}</p>
        <p><strong>Pickup Time:</strong> {order.pickup_time ? new Date(order.pickup_time).toLocaleString() : "Not Picked"}</p>
        <p><strong>Delivery Time:</strong> {order.delivery_time ? new Date(order.delivery_time).toLocaleString() : "Not Delivered"}</p>
      </div>
    </div>

    {/* Deadline History */}
    {order.deadlines && order.deadlines.length > 0 && (
      <div className="bg-white shadow-md rounded mb-6">
        <div className="bg-gray-800 text-white px-4 py-2 font-semibold rounded-t">
          Deadline History
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Deadline Type</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Expires At</th>
              </tr>
            </thead>
            <tbody>
              {order.deadlines.map((deadline, index) => (
                <tr key={deadline.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{deadline.deadline_type}</td>
                  <td className="border px-3 py-2">{deadline.status}</td>
                  <td className="border px-3 py-2">
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
const statusColorMap = {
  registered: "bg-gray-500",
  assigned: "bg-blue-500",
  picked: "bg-indigo-600",
  delivered: "bg-green-600",
  cancelled: "bg-red-600",
  default: "bg-gray-800",
};

const getStatusColor = (status) => {
  return statusColorMap[status] || statusColorMap.default;
};



export default ViewOrder;
