import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
 const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ViewAssignment = () => {
  const [otp, setOtp] = useState("");
  const [deliveryOtp, setDeliveryOtp] = useState("");
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/riders/viewAssignment/${id}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.success) {
          setAssignment(response.data.assignment);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    };

    fetchAssignment();
  }, [id]);

  if (!assignment) {
    return (
      <div className="text-center mt-5">Loading assignment details...</div>
    );
  }

  const handlePickupOtpSubmit = async () => {
    const pickupOtpSubmitBtn = document.getElementById("submit-pickup-otp-btn");
    if (pickupOtpSubmitBtn) {
      pickupOtpSubmitBtn.disabled = true;
    }
    try {
      const response = await axios.post(
        `${baseUrl}/api/riders/submitPickupOtp`,
        {
          otp: otp,
          unique_id: assignment.unique_id,
          id: assignment.id,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200 && response.data.success) {
        pickupOtpSubmitBtn.disabled = false;
        alert("Delivery OTP submitted successfully.");
        console.log(response.data.message);
      }
      if (response && response.status === 400) {
        pickupOtpSubmitBtn.disabled = false;
        alert(response.data.message);
      }
    } catch (error) {
      pickupOtpSubmitBtn.disabled = false;
      console.error("Error submitting delivery OTP:", error);
      alert("The OTP is incorrect or the assignment has already been picked.");
    }
  };

  const generateDeliveryOtp = async () => {
    const generateOtpBtn = document.getElementById("generate-otp-btn");
    if (generateOtpBtn) {
      generateOtpBtn.disabled = true; // Disable the button to prevent multiple clicks
    }
    try {
      const response = await axios.post(
        `${baseUrl}/api/riders/generateDeliveryOtp`,
        {
          unique_id: assignment.unique_id,
          id: assignment.id,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200 && response.data.success) {
        generateOtpBtn.disabled = false;
        alert("Delivery OTP generated successfully.");
        console.log(response.data.message);
      }
    } catch (error) {
      generateOtpBtn.disabled = false;

      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "Bad Request");
      } else {
        console.error("Error generating delivery OTP:", error);
        alert("Failed to generate delivery OTP. Please try again.");
      }
    }
  };

  const handleDeliveryOtpSubmit = async () => {
    const deliveryOtpSubmitBtn = document.getElementById(
      "submit-delivery-otp-btn"
    );
    deliveryOtpSubmitBtn.disabled = true;
    try {
      const response = await axios.post(
        `${baseUrl}/api/riders/submitDeliveryOtp`,
        {
          deliveryOtp: deliveryOtp,
          unique_id: assignment.unique_id,
          id: assignment.id,
        },
        { withCredentials: true }
      );

      if (response && response.status === 200) {
        alert(response.data.message);
      }
      deliveryOtpSubmitBtn.disabled = false;
    } catch (error) {
      deliveryOtpSubmitBtn.disabled = false;
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "Bad Request");
      } else {
        console.error("Error submitting delivery OTP:", error);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h4 className="text-white text-xl font-semibold">
            Assignment #{assignment.id}
          </h4>
          <p className="text-blue-100 text-sm">
            Unique ID: {assignment.unique_id}
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/2">
              {assignment.status === "picked" ? (
                <button
                  id="generate-otp-btn"
                  onClick={generateDeliveryOtp}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Generate Delivery OTP
                </button>
              ) : (
                <p className="text-gray-700">
                  Assignment either not picked yet or delivered already
                </p>
              )}
            </div>

            <div className="md:w-1/2">
              {(() => {
                if (assignment.status === "delivered") {
                  return (
                    <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded">
                      <strong className="block mb-1">
                        Assignment Delivered!
                      </strong>
                      No further action required.
                    </div>
                  );
                } else if (assignment.status !== "picked") {
                  return (
                    <div className="bg-gray-100 p-4 border rounded shadow-sm">
                      <label
                        htmlFor="pickup-otp"
                        className="font-semibold block mb-2"
                      >
                        Enter Pickup OTP Given By Customer Sender
                      </label>
                      <input
                        id="pickup-otp"
                        type="text"
                        className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button
                        id="submit-pickup-otp-btn"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        onClick={handlePickupOtpSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  );
                } else if (assignment.status === "picked") {
                  return (
                    <div className="bg-gray-100 p-4 border rounded shadow-sm">
                      <p className="text-blue-600 font-medium mb-2">
                        The assignment has been picked up for delivery.
                      </p>
                      <label
                        htmlFor="delivery-otp"
                        className="font-semibold block mb-2"
                      >
                        Enter Delivery OTP Given By Parcel Receiver
                      </label>
                      <input
                        id="delivery-otp"
                        type="text"
                        className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setDeliveryOtp(e.target.value)}
                        value={deliveryOtp}
                      />
                      <button
                        id="submit-delivery-otp-btn"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={handleDeliveryOtpSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  );
                } else {
                  return null;
                }
              })()}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/2">
              <h5 className="text-gray-600 font-semibold">Source Address</h5>
              <p>{assignment.source_address}</p>
            </div>
            <div className="md:w-1/2">
              <h5 className="text-gray-600 font-semibold">
                Destination Address
              </h5>
              <p>{assignment.dest_address}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/2">
              <h6 className="font-semibold">Sender Phone</h6>
              <p>{assignment.phone_sender}</p>
            </div>
            <div className="md:w-1/2">
              <h6 className="font-semibold">Receiver Phone</h6>
              <p>{assignment.phone_receiver}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/3">
              <h6 className="font-semibold">Status</h6>
              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${
                  assignment.status === "assigned"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              >
                {assignment.status}
              </span>
            </div>
            <div className="md:w-1/3">
              <h6 className="font-semibold">Payment Status</h6>
              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${
                  assignment.payment_status === "yes"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {assignment.payment_status}
              </span>
            </div>
            <div className="md:w-1/3">
              <h6 className="font-semibold">Customer Deadline</h6>
              <p>{new Date(assignment.customer_deadline).toLocaleString()}</p>
            </div>
          </div>

          <hr className="my-6" />

          <h5 className="text-lg font-semibold mb-3">Deadlines</h5>
          {assignment.deadlines.length === 0 ? (
            <p className="text-gray-500">No deadlines associated.</p>
          ) : (
            <ul className="space-y-4">
              {assignment.deadlines.map((dl) => (
                <li key={dl.id} className="border p-3 rounded bg-gray-50">
                  <p>
                    <strong>Type:</strong> {dl.deadline_type} |{" "}
                    <strong>Status:</strong> {dl.status}
                  </p>
                  <p>
                    <strong>Expires:</strong>{" "}
                    {new Date(dl.deadline_expire_time).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-100 px-6 py-4 text-right text-sm text-gray-600">
          Last updated: {new Date(assignment.updatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ViewAssignment;
