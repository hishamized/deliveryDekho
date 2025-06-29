import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 const baseUrl = import.meta.env.VITE_API_BASE_URL;

function RiderLogin({setRider}) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRiderLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${baseUrl}/api/riders/login`,
        { emailOrPhone, password },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.success === true) {
        setRider(response.data.rider);
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
    <>
      <div className="w-screen flex justify-center items-center">
        <form
          className="flex flex-col bg-[#82aaa2] items-center w-full gap-3 pt-8"
          onSubmit={handleRiderLogin}
        >
          <img className="w-[200px]" src="/images/logo.png" alt="Logo" />

          <h1 className="text-2xl font-bold uppercase text-white drop-shadow-sm">
            Express
          </h1>

          <div className="flex flex-row gap-2">
            <h1 className="text-3xl text-black [text-shadow:_2px_2px_0px_white] font-bold">
              Delivery
            </h1>
            <h1 className="text-3xl text-red-600 [text-shadow:_2px_2px_0px_white] font-bold">
              Dekho
            </h1>
          </div>

          <div className="w-full lg:w-[30vw] pr-20 pl-20">
            <input
              placeholder="Email or Phone"
              type="text"
              className="border border-white text-white bg-transparent p-2 rounded-l-full rounded-r-full w-full"
              value={emailOrPhone}
              required
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </div>

          <div className="w-full lg:w-[30vw] pr-20 pl-20">
            <input
              placeholder="Password"
              type="password"
              className="border border-white text-white bg-transparent p-2 rounded-l-full rounded-r-full w-full"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

          <div className="flex flex-col gap-3 bg-[#FFFFFF] w-full items-center pt-8 pb-8 rounded-t-3xl">
            <a className="text-[#32675d] text-sm" href="#">
              Forgot Password?
            </a>
            <div className="w-full lg:w-[30vw] pr-20 pl-20">
              <button
                type="submit"
                className="bg-[#32675d] text-white p-2 rounded-l-full rounded-r-full w-full border border-[#82aaa2] shadow-xl"
              >
                Login
              </button>
            </div>
            <p className="text-black">www.deliverydekho.com</p>
            <div className="flex flex-row items-center gap-1">
              <i className="fa-brands fa-square-instagram text-[#b23e7c] text-2xl"></i>
              <p>@deliverydekho</p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default RiderLogin;
