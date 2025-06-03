// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admins/check-session', {
          withCredentials: true,
        });

        if (response.data.loggedIn) {
          setAdmin(response.data.admin);
        }
      } catch (error) {
        console.error('Session check failed', error);
      }
    };

    checkAdminSession();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/admins/logout', {}, { withCredentials: true });
      setAdmin(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand" to="/">Delivery Dekho</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* <li className="nav-item"><Link className="nav-link" to="#">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="#">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="#">Services</Link></li>
            <li className="nav-item"><Link className="nav-link" to="#">Projects</Link></li>
            <li className="nav-item"><Link className="nav-link" to="#">Contact</Link></li> */}
            {admin ? (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" href="#"
                 onClick={ (e) => {
                   e.preventDefault();
                   navigate('/admin/AdminDashboard');
                 } }>Admin</Link>
                 </li>
                <li className="nav-item"><Link className="nav-link" href="#" onClick={ (e) => {
                   e.preventDefault();
                   navigate('/rider/RiderDashboard');
                 } }>Rider</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
