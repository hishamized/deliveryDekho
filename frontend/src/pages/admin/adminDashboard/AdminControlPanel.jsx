import React, { useEffect, useState } from "react";
import axios from "axios";


import dayjs from "dayjs";
import CountdownTimer from "../../rider/utilityComponents/CountdownTimer";
/*
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
*/

import { useNavigate } from "react-router-dom";
  const baseURL = import.meta.env.VITE_API_BASE_URL;
const AdminControlPanel = () => {

  const [pickupOtp, setPickupOtp] = useState("");
  const [deliveryOtp, setDeliveryOtp] = useState("");
  const navigate = useNavigate();
  const handleAdminLogout = async () => {
    console.log("Logging out admin...");
    try {
      await axios.post(
        `${baseURL}/api/admins/logout`,
        {},
        { withCredentials: true }
      );
      navigate("/admin/AdminLogin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [RiderId, setRiderId] = useState(null);
  const [Rider, setRider] = useState("");
  const [Assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await axios.get(
          `${baseURL}/api/admins/check-session`,
          { withCredentials: true }
        );

        if (sessionRes.status === 200 && sessionRes.data.admin) {
          const id = sessionRes.data.admin.id;
          setRiderId(id);
          setRider(sessionRes.data.admin);

          const assignmentsRes = await axios.get(
            `${baseURL}/api/admins/getOrders`,
            { withCredentials: true }
          );

          if (assignmentsRes.status === 200 && assignmentsRes.data.success) {
            setAssignments(assignmentsRes.data.orders);
          }
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handlePickupOtpSubmit = async (id, u_id) => {
    const pickupOtpSubmitBtn = document.getElementById("submit-pickup-otp-btn");
    if (pickupOtpSubmitBtn) {
      pickupOtpSubmitBtn.disabled = true;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/admins/submitPickupOtp`,
        {
          otp: pickupOtp,
          unique_id: u_id,
          id: id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.success) {
        alert("Delivery OTP submitted successfully.");

        // ✅ Re-fetch assignments
        const assignmentsRes = await axios.get(
          `${baseURL}/api/admins/getOrders`,
          { withCredentials: true }
        );

        if (assignmentsRes.status === 200 && assignmentsRes.data.success) {
          setAssignments(assignmentsRes.data.orders); // this will trigger a re-render
        }
      } else if (response && response.status === 400) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting delivery OTP:", error);
      alert("The OTP is incorrect or the assignment has already been picked.");
    } finally {
      if (pickupOtpSubmitBtn) pickupOtpSubmitBtn.disabled = false;
    }
  };

  const generateDeliveryOtp = async (id, u_id) => {
    const generateOtpBtn = document.getElementById("generate-otp-btn");
    if (generateOtpBtn) {
      generateOtpBtn.disabled = true; // Disable the button to prevent multiple clicks
    }
    try {
      const response = await axios.post(
        `${baseURL}/api/admins/generateDeliveryOtp`,
        {
          unique_id: u_id,
          id: id,
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

  const handleDeliveryOtpSubmit = async (id, u_id) => {
    const deliveryOtpSubmitBtn = document.getElementById(
      "submit-delivery-otp-btn"
    );
    deliveryOtpSubmitBtn.disabled = true;
    try {
      const response = await axios.post(
        `${baseURL}/api/admins/submitDeliveryOtp`,
        {
          deliveryOtp: deliveryOtp,
          unique_id: u_id,
          id: id,
        },
        { withCredentials: true }
      );

      if (response && response.status === 200) {
        alert(response.data.message);
      }
      deliveryOtpSubmitBtn.disabled = false;

      const assignmentsRes = await axios.get(
        `${baseURL}/api/admins/getOrders`,
        { withCredentials: true }
      );

      if (assignmentsRes.status === 200 && assignmentsRes.data.success) {
        setAssignments(assignmentsRes.data.orders); // this will trigger a re-render
      }
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
    <div>
      <div className="flex flex-row p-2 rounded-2xl justify-between items-center  bg-gradient-to-r from-[#4b8378] to-[#2e6158] text-white pt-6 pb-6">
        {/* <div className="w-15 h-15 rounded-full overflow-hidden">
          <img
            src={`${baseURL}/${Rider.photo}`}
            alt="Rider Profile Photo"
            className="w-full h-full object-cover"
          />
        </div> */}

        <div className="flex flex-col items-start">
          <h2 className="text-lg font-semibold">Welcome</h2>
          <p className="text-white-600">Admin - {Rider.name}</p>
        </div>
        <div>
          <button
            onClick={() => handleAdminLogout()}
            className="bg-transparent border-2 rounded-3xl text-white py-2 px-4  hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 items-center bg-gradient-to-t from-[#bad0cd] to-[#aac7c3]">
        <h1 className="text-white text-2xl font-bold">My Deliveries</h1>
        <div className="flex flex-row gap-10 items-center justify-around w-full">
          <div className="flex flex-col gap-1 items-center text-white w-full">
            <h3 className="text-lg font-bold">Assigned</h3>
            <p className="bg-[#5271ff] rounded-2xl p-10 text-3xl w-full text-center">
              {Assignments
                ? Object.values(Assignments).filter(
                    (a) => a.status === "registered"
                  ).length
                : 0}
            </p>
          </div>
          <div className="flex flex-col gap-1 items-center text-white w-full">
            <h3 className="text-lg font-bold">Delivered</h3>
            <p className="bg-[#02be5f] rounded-2xl p-10 text-3xl w-full text-center">
              {Assignments
                ? Object.values(Assignments).filter(
                    (a) => a.status === "delivered"
                  ).length
                : 0}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-10 items-center justify-around w-full">
          <div className="flex flex-col gap-1 items-center text-white w-full">
            <h3 className="text-lg font-bold">Pending</h3>
            <p className="bg-[#ff3131] rounded-2xl p-10 text-3xl w-full text-center">
              {Assignments
                ? Object.values(Assignments).filter(
                    (a) => a.status !== "delivered"
                  ).length
                : 0}
            </p>
          </div>
          <div className="flex flex-col gap-1 items-center text-white w-full">
            <h3 className="text-lg font-bold">All</h3>
            <p className="bg-[#fdbd58] rounded-2xl p-10 text-3xl w-full text-center">
              {Assignments && Object.values(Assignments).length > 0
                ? Object.values(Assignments).length
                : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#d9d9d9] p-2">
        {Assignments && Object.values(Assignments).length > 0 ? (
          Object.values(Assignments).map((assignment, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-4 rounded-md mb-4 flex flex-col gap-2"
            >
              <div className="flex flex-row items-center justify-end gap-2">
                {assignment.status === "registered" ? (
                  <>
                    <span className="text-black-500">Pickup OTP</span>
                    <input
                      className="border-b-2 border-dashed w-24"
                      type="text"
                      onChange={(e) => setPickupOtp(e.target.value)}
                    />
                  </>
                ) : assignment.status === "picked" ? (
                  <>
                    <button
                      id="generate-otp-btn"
                      onClick={() =>
                        generateDeliveryOtp(assignment.id, assignment.unique_id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
                    >
                      Generate OTP
                    </button>
                    <span className="text-black-500">Delivery OTP</span>
                    <input
                      className="border-b-2 border-dashed w-24"
                      type="text"
                      onChange={(e) => setDeliveryOtp(e.target.value)}
                    />
                  </>
                ) : assignment.status === "delivered" ? (
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    Delivered
                  </span>
                ) : (
                  <span className="text-red-500">Unknown Status</span>
                )}
              </div>
              <div className="flex flex-row gap-1 items-center justify-evenly">
                {/* <div className="w-15 h-15 rounded-full overflow-hidden">
                  <img
                    src={`${baseURL}/${Rider.photo}`}
                    alt="Rider Profile Photo"
                    className="w-full h-full object-cover"
                  />
                </div> */}
                <div className="flex flex-col gap-1">
                  {assignment.status === "registered" ? (
                    <>
                      <span className="text-black-500 font-bold">
                        {assignment.sender_name}
                      </span>
                      <span className="text-black-500">
                        {assignment.source_address}
                      </span>
                      <span className="text-black-500">
                        {assignment.phone_sender}
                      </span>
                    </>
                  ) : assignment.status === "picked" ? (
                    <>
                      <span className="text-black-500 font-bold">
                        {assignment.receiver_name}
                      </span>
                      <span className="text-black-500">
                        {assignment.dest_address}
                      </span>
                      <span className="text-black-500">
                        {assignment.phone_receiver}
                      </span>
                    </>
                  ) : assignment.status === "delivered" ? (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                      Order Delivered!
                    </span>
                  ) : (
                    <span className="text-red-500">Unknown Error</span>
                  )}
                </div>
                <div className="flex flex-col items-end justify-center gap-1">
                  {assignment.status === "registered" ? (
                    <>
                      <button
                        id="submit-pickup-otp-btn"
                        className="bg-[#00c064] p-1 w-24 font-bold"
                        onClick={() =>
                          handlePickupOtpSubmit(
                            assignment.id,
                            assignment.unique_id
                          )
                        }
                      >
                        Submit
                      </button>
                      {assignment.deadlines.find(
                        (d) => d.deadline_type === "pickup"
                      ) && (
                        <>
                          <span className="text-sm">
                            {dayjs(
                              assignment.deadlines.find(
                                (d) => d.deadline_type === "pickup"
                              )?.deadline_expire_time
                            ).format("DD MMMM YYYY - hh:mm A")}
                          </span>
                          <CountdownTimer
                            deadline={
                              assignment.deadlines.find(
                                (d) => d.deadline_type === "pickup"
                              )?.deadline_expire_time
                            }
                          />
                        </>
                      )}
                    </>
                  ) : assignment.status === "picked" ? (
                    <>
                      <button
                        id="submit-delivery-otp-btn"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() =>
                          handleDeliveryOtpSubmit(
                            assignment.id,
                            assignment.unique_id
                          )
                        }
                      >
                        Submit
                      </button>
                      {assignment.deadlines.find(
                        (d) => d.deadline_type === "delivery"
                      ) && (
                        <>
                          <span className="text-sm">
                            {dayjs(
                              assignment.deadlines.find(
                                (d) => d.deadline_type === "delivery"
                              )?.deadline_expire_time
                            ).format("DD MMMM YYYY - hh:mm A")}
                          </span>
                          <CountdownTimer
                            deadline={
                              assignment.deadlines.find(
                                (d) => d.deadline_type === "delivery"
                              )?.deadline_expire_time
                            }
                          />
                        </>
                      )}
                    </>
                  ) : assignment.status === "delivered" ? (
                    <span className="text-black-500">
                      Delivered at{" "}
                      {dayjs(assignment.delivery_time).format(
                        "DD MMMM YYYY - hh:mm A"
                      )}
                    </span>
                  ) : (
                    <span className="text-black-500">Unknown Error</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No assignments found.</p>
        )}
      </div>
      {/* <pre>{JSON.stringify(Assignments, null, 2)}</pre> */}
    </div>
  );
};

export default AdminControlPanel;
