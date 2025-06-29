// src/pages/admin/adminDashboard/PlaceOrder.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const PlaceOrder = () => {
  
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [sourceAddress, setSourceAddress] = useState("");
  const [destAddress, setDestAddress] = useState("");
  const [phoneSender, setPhoneSender] = useState("");
  const [phoneReceiver, setPhoneReceiver] = useState("");
  const [sendOtp, setSendOtp] = useState(generateOTP()); // Generate OTP once
  const [assignedRiderId, setAssignedRiderId] = useState("");
  const [customerDeadline, setCustomerDeadline] = useState("");
  const [deadline_type, setDeadlineType] = useState("");
  const [deadline_expire_time, setDeadlineExpireTime] = useState("");
  const [riders, setRiders] = useState([]);

  useEffect(() => {
    // Fetch all riders from API
    axios
      .get(`${baseUrl}/api/admins/riders`, { withCredentials: true })
      .then((response) => {
        console.log("Fetched riders:", response.data);
        setRiders(response.data.riders || []);
      })
      .catch((error) => console.error("Error fetching riders:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseUrl}/api/admins/placeOrder`,
        {
          sender_name: senderName,
          receiver_name: receiverName,
          source_address: sourceAddress,
          dest_address: destAddress,
          phone_sender: phoneSender,
          phone_receiver: phoneReceiver,
          send_otp: sendOtp,
          assigned_rider_id: assignedRiderId || null,
          customer_deadline: customerDeadline,
          deadline_expire_time: deadline_expire_time,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Order placed successfully!");
        setSourceAddress("");
        setDestAddress("");
        setPhoneSender("");
        setPhoneReceiver("");
        setAssignedRiderId("");
        setCustomerDeadline("");
      } else {
        alert("Failed to place order: " + response.data.message);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Place New Order
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sender Name
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receiver Name
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source Address
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={sourceAddress}
            onChange={(e) => setSourceAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Destination Address
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={destAddress}
            onChange={(e) => setDestAddress(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sender Phone
          </label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={phoneSender}
            onChange={(e) => setPhoneSender(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Send OTP
          </label>
          <input
            type="text"
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2"
            value={sendOtp}
            onChange={(e) => setSendOtp(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receiver Phone
          </label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={phoneReceiver}
            onChange={(e) => setPhoneReceiver(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign to Rider
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={assignedRiderId}
            onChange={(e) => setAssignedRiderId(e.target.value)}
          >
            <option value="">Select Rider (optional)</option>
            {riders.map((rider) => (
              <option key={rider.id} value={rider.id}>
                {rider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Deadline As Per Customer
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={customerDeadline}
            onChange={(e) => setCustomerDeadline(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deadline Type
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={deadline_type}
            onChange={(e) => setDeadlineType(e.target.value)}
          >
            <option value="">Select Deadline Type</option>
            <option value="pickup">Pickup</option>
            <option value="delivery" disabled>
              Delivery
            </option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Deadline Expire Time
          </label>
          <input
            type="datetime-local"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            value={deadline_expire_time}
            onChange={(e) => {
              setDeadlineExpireTime(e.target.value);
            }}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
