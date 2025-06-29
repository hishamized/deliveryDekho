import React from "react";
import { useNavigate } from "react-router-dom"; // if you use react-router

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <main className="flex-grow flex justify-center items-center px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
          <h2 className="text-2xl font-semibold mb-4">Who are you?</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Please select your role to continue
          </p>
          <div className="flex justify-around gap-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded text-lg"
              onClick={() => navigate("/admin/AdminLogin")}
            >
              Admin
            </button>
            <button
              className="border border-green-600 text-green-600 hover:bg-green-100 font-semibold py-2 px-6 rounded text-lg"
              onClick={() => navigate("/rider/RiderLogin")}
            >
              Rider
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
