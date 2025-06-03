import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
   const [error, setError] = useState(''); 

  const handleLogin = async (e) => {
    e.preventDefault();
     setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/admins/login', {
        email,
        password,
      }, {withCredentials: true});

      if (response.data.success) {
        navigate('/admin/AdminDashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      // alert('Login failed. Please check your credentials.');
      if (err.response && err.response.data) {
        setError(err.response.data.message); 
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
   <div className="container d-flex justify-content-center align-items-center min-vh-100">
  <div className="col-md-6 col-lg-5 border border-3 rounded-4 shadow p-4 bg-white">
    <h2 className="text-center mb-4">Admin Login</h2>
    <form onSubmit={handleLogin}>
      <div className="form-group mb-3">
        <label>Email:</label>
        <input
          type="email"
          className="form-control"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <label>Password:</label>
        <input
          type="password"
          className="form-control"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <button type="submit" className="btn btn-success w-100">Login</button>
    </form>
  </div>
</div>

  );
}

export default AdminLogin;
