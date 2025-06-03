import React, { useState } from "react";
import axios from "axios";

export default function RegisterAdmin() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    role: "dispatcher",
    is_active: true,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:5000/api/admins/register", formData, {withCredentials: true});
      if (response.data.success) {
        setSuccess(response.data);
        setFormData({
          name: "",
          phone: "",
          email: "",
          address: "",
          password: "",
          role: "dispatcher",
          is_active: true,
        });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Error registering admin");
      }
    }
  };

  return (
    <div className="container mt-5">
      {success && (
        <div className="alert alert-success" role="alert">
          {success.message}
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <h2 className="mb-4">Register Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
          <input
            type="tel"
            pattern="[0-9]{10,15}"
            title="Enter a valid phone number"
            className="form-control"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <textarea
            className="form-control"
            id="address"
            name="address"
            rows="2"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <select
            className="form-select"
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
          >
            <option value="super_admin">Super Admin</option>
            <option value="dispatcher">Dispatcher</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="is_active">
            Active
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
