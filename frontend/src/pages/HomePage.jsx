import React from 'react';
import { useNavigate } from 'react-router-dom'; // if you use react-router

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main content */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="card shadow p-5 text-center" style={{ minWidth: '320px', maxWidth: '400px' }}>
          <h2 className="mb-4">Who are you?</h2>
          <p className="mb-4 lead">Please select your role to continue</p>
          <div className="d-flex justify-content-around">
            <button
              className="btn btn-success btn-lg"
              onClick={() => navigate('/admin/AdminLogin')}
            >
              Admin
            </button>
            <button
              className="btn btn-outline-success btn-lg"
              onClick={() => navigate('/rider/RiderLogin')}
            >
              Rider
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
