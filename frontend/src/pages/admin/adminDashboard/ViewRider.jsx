import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
  const baseURL = import.meta.env.VITE_API_BASE_URL;

const ViewRider = () => {

  const { id } = useParams();
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRider = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/api/admins/rider/${id}`,
          { withCredentials: true }
        );
        const data =
          typeof response.data === "string"
            ? JSON.parse(response.data)
            : response.data;
        setRider(data.rider);
        setLoading(false);
      } catch (err) {
        setError(
          "Failed to load rider details".concat(
            err.response ? `: ${err.response.data.message}` : ""
          )
        );
        setLoading(false);
      }
    };

    fetchRider();
  }, [id]);

  if (loading)
    return (
      <div className="container mt-5">
        <div className="alert alert-info">Loading rider details...</div>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img
              src={`${baseURL}/${rider.photo}`}
              alt="Rider Photo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h5 className="text-2xl font-bold mb-4">{rider.name}</h5>
            <p className="mb-2">
              <strong>Phone:</strong> {rider.phone}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {rider.email || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Address:</strong> {rider.address || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Driver License:</strong> {rider.driver_license_number}
            </p>
            <p className="mb-2">
              <strong>Vehicle Reg.:</strong> {rider.vehicle_registration_number}
            </p>
            <p className="mb-2">
              <strong>Aadhaar:</strong> {rider.adhaar_number}
            </p>
            <p className="mb-2">
              <strong>PAN Card:</strong> {rider.pan_card_number}
            </p>
            <p className="mb-2">
              <strong>Availability:</strong>{" "}
              {rider.availability_status ? "Available" : "Unavailable"}
            </p>
            <p className="mb-2">
              <strong>Active:</strong> {rider.is_active ? "Yes" : "No"}
            </p>
            <p className="mb-2">
              <strong>Last Seen:</strong>{" "}
              {rider.last_seen
                ? new Date(rider.last_seen).toLocaleString()
                : "N/A"}
            </p>
            <p className="mb-2">
              <strong>Current Location:</strong>{" "}
              {rider.current_location || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRider;
