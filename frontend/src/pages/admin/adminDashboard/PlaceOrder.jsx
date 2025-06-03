// src/pages/admin/adminDashboard/PlaceOrder.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};


const PlaceOrder = () => {;
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
      .get("http://localhost:5000/api/admins/riders", {withCredentials: true})
      .then((response) => {
        console.log("Fetched riders:", response.data);
        setRiders(response.data.riders || []);
      })
      .catch((error) => console.error("Error fetching riders:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/admins/placeOrder", {
        source_address: sourceAddress,
        dest_address: destAddress,
        phone_sender: phoneSender,
        phone_receiver: phoneReceiver,
        send_otp: sendOtp,
        assigned_rider_id: assignedRiderId || null,
        customer_deadline: customerDeadline,
      }, {withCredentials: true});

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
    <div className="container mt-4">
      <h2>Place New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Source Address</label>
          <textarea
            className="form-control"
            value={sourceAddress}
            onChange={(e) => setSourceAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Destination Address</label>
          <textarea
            className="form-control"
            value={destAddress}
            onChange={(e) => setDestAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Sender Phone</label>
          <input
            type="tel"
            className="form-control"
            value={phoneSender}
            onChange={(e) => setPhoneSender(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Send OTP</label>
          <input
            type="text"
            className="form-control"
            value={sendOtp}
            onChange={(e) => setSendOtp(e.target.value)}
            required
            disabled
          />
        </div>
        <div className="mb-3">
          <label>Receiver Phone</label>
          <input
            type="tel"
            className="form-control"
            value={phoneReceiver}
            onChange={(e) => setPhoneReceiver(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Assign to Rider</label>
          <select
            className="form-select"
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
        <div className="mb-3">
          <label>Delivery Deadline As Per Customer</label>
          <input
            type="datetime-local"
            className="form-control"
            value={customerDeadline}
            onChange={(e) => setCustomerDeadline(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Deadline Type</label>
          <select
            className="form-select"
            value={deadline_type}
            onChange={(e) => setDeadlineType(e.target.value)}
          >
            <option value="">Select Deadline Type</option>
            <option value="pickup" default >Pickup</option>
            <option value="delivery" disabled>Delivery</option>
          </select>
        </div>
        <div className="mb-3">
          <label>Pickup Deadline Expire Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={deadline_expire_time}
            onChange={(e) => setDeadlineExpireTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default PlaceOrder;
