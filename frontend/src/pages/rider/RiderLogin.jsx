import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RiderLogin = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const navigate = useNavigate();
  const handleRiderLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:5000/api/riders/login",
      { emailOrPhone, password },
      { withCredentials: true }
    );

    if (response.status === 200 && response.data.success === true) {
      navigate("/rider/RiderDashboard");
    }
  } catch (error) {
    console.error("Login failed:", error);
    
    if (error.response) {
      if (error.response.status === 404) {
        setError("Invalid email or phone number");
      } else if (error.response.status === 401) {
        setError("Invalid password");
      } else {
        setError("Login error: " + error.response.data.message);
      }
    } else {
      setError("Network error. Please try again.");
    }
  }
};


  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="mb-4 text-center">Rider Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleRiderLogin} method="POST">
          <div className="mb-3">
            <label htmlFor="emailOrPhone" className="form-label">
              Email or Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="emailOrPhone"
              placeholder="Enter email or phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RiderLogin;
