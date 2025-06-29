import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
const Deadlines = () => {
  
  const [deadlines, setDeadlines] = useState(null);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/admins/getDeadlines`,
          {
            withCredentials: true,
          }
        );
        if (response && response.status === 200) {
          console.log("Fetched deadlines:", response.data.deadlines);
          setDeadlines(response.data.deadlines);
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 400) {
          alert("Error: " + error.response.data.message);
        }
      }
    };

    fetchDeadlines();
  }, []); 

 return (
  <div className="w-full px-4 mt-6">
    <h1 className="text-2xl font-semibold mb-6">Missed Deadlines</h1>

    {!deadlines ? (
      <p className="text-gray-600">Loading...</p>
    ) : (
      deadlines.map((dl) => (
        <div
          key={dl.id}
          className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg mb-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4"
        >
          <div>
            <h5 className="text-lg font-semibold mb-2">Missed Deadline</h5>
            <p className="mb-1">
              <span className="font-semibold">Type:</span> {dl.deadline_type}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Status:</span>{" "}
              <span className="inline-block bg-red-200 text-red-700 text-xs font-medium px-2 py-1 rounded">
                {dl.status}
              </span>
            </p>
            <p className="mb-1">
              <span className="font-semibold">Expired At:</span>{" "}
              {new Date(dl.deadline_expire_time).toLocaleString()}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Order ID:</span> {dl.order_id}
            </p>
          </div>

          <div className="self-start">
            <Link
              to={`/admin/AdminDashboard/view-order/${dl.order_id}`}
              className="inline-block bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded shadow"
            >
              View Order
            </Link>
          </div>
        </div>
      ))
    )}
  </div>
);

};

export default Deadlines;
