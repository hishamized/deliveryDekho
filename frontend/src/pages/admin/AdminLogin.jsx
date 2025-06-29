import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
 const baseUrl = import.meta.env.VITE_API_BASE_URL;
function AdminLogin({setAdmin}) {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${baseUrl}/api/admins/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setAdmin(response.data.admin);
        navigate("/admin/AdminDashboard");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error(err);
      // alert('Login failed. Please check your credentials.');
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <>
      <div className="w-screen flex justify-center items-center">
        <form
          className="flex flex-col bg-[#82aaa2] items-center w-full gap-3 pt-8"
          onSubmit={handleLogin}
        >
          <img className="w-[200px]" src="/images/logo.png" alt="Logo" />

          <h1 class="text-2xl font-bold uppercase text-white drop-shadow-sm">Express</h1>

          <div className="flex flex-row gap-2">
            <h1 className="text-3xl text-black [text-shadow:_2px_2px_0px_white] font-bold">Delivery</h1>
            <h1 className="text-3xl text-red-600 [text-shadow:_2px_2px_0px_white] font-bold">Dekho</h1>
          </div>

          <div className="w-full lg:w-[30vw] pr-20 pl-20">
             <input
              placeholder="Email ID"
              type="email"
              className="border border-white text-white bg-transparent p-2 rounded-l-full rounded-r-full w-full "
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
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
            <a className="text-[#32675d] text-sm" href="#">Forgot Password?</a>
            <div className="w-full lg:w-[30vw] pr-20 pl-20">
              <button type="submit" className="bg-[#32675d] text-white p-2 rounded-l-full rounded-r-full w-full border border-[#82aaa2] shadow-xl">
              Login
            </button>
            </div>
            <p className="text-black">www.deliverydekho.com</p>
            <div className="flex flex-row items-center gap-1"> 
              <i class="fa-brands fa-square-instagram text-[#b23e7c] text-2xl"></i>
              <p>@deliverydekho</p>
              </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminLogin;
