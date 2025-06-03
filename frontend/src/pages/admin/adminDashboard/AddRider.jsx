import React, { useState } from "react";
import axios from "axios";
// import { useNavigate } from 'react-router-dom';

export default function AddRider() {
  //   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    driver_license_number: "",
    vehicle_registration_number: "",
    adhaar_number: "",
    pan_card_number: "",
    photo: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (file && file.size > 5 * 1024 * 1024) { // 5MB limit example
    setError("Photo size should be less than 5MB");
    return;
  }
  setFormData((prev) => ({ ...prev, photo: file }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post(
        "http://localhost:5000/api/admins/add-rider",
        {withCredentials: true},
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        setSuccess("Rider added successfully!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          password: "",
          driver_license_number: "",
          vehicle_registration_number: "",
          adhaar_number: "",
          pan_card_number: "",
          photo: null,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add rider.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-success mb-4">Add Rider</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Driver License Number</label>
          <input
            type="text"
            className="form-control"
            name="driver_license_number"
            value={formData.driver_license_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Vehicle Registration Number</label>
          <input
            type="text"
            className="form-control"
            name="vehicle_registration_number"
            value={formData.vehicle_registration_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Adhaar Card Number</label>
          <input
            type="text"
            className="form-control"
            name="adhaar_number"
            value={formData.adhaar_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Pan Card Number</label>
          <input
            type="text"
            className="form-control"
            name="pan_card_number"
            value={formData.pan_card_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Photo</label>
          <input
            type="file"
            className="form-control"
            name="photo"
            accept="image/*"
            onChange={(e) => handlePhotoChange(e)}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Add Rider
        </button>
      </form>
    </div>
  );
}
