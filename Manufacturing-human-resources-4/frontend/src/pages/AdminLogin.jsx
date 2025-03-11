import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import layoutImage from "../Components/Assets/layout.jpg"; // Company Branding Image
import axios from 'axios'; // Import axios
import { MetroSpinner } from 'react-spinners-kit';

const ADMINLOGIN = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/testLog"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/testLog";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "", // Changed from username to email
    password: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [fadeInForm, setFadeInForm] = useState(false);
  const [fadeInText, setFadeInText] = useState(false);
  

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setFadeInForm(true);
    }, 1000);

    setTimeout(() => {
      setFadeInText(true);
    }, 1500);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    console.log('Attempting login with:', { email: formData.email });
  
    try {
      console.log('Making API request to:', ADMINLOGIN);
      const response = await axios.post(ADMINLOGIN, formData);
      console.log('Server response:', response.data);

      if (response.data && response.data.token) {
        // Check if user has Admin role
        if (response.data.user.role !== "Admin") {
          throw new Error("Access denied. Only HR Administrators can login here.");
        }
        
        // Store the token and user data
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", response.data.user?.role || "admin");
        sessionStorage.setItem("accessToken", response.data.token);
  
        setSuccess("Login successful! Redirecting...");
  
        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 2000);
      } else {
        throw new Error("Login failed - No token received");
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        setError(`Login failed: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        setError("Network error - Could not connect to the server. Please check your internet connection.");
      } else {
        setError(`Login error: ${error.message}`);
      }
      
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center text-gray-700">
          <SyncLoader
            cssOverride={{}}
            loading
            color="#000000"
            margin={12}
            size={15}
            speedMultiplier={0.5}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`flex justify-center items-center w-full md:w-1/2 p-10 transform transition-opacity duration-1000 ${fadeInForm ? "opacity-100" : "opacity-0"}`}>
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md p-8 bg-white shadow-2xl rounded-lg border border-gray-200">
          <h2 className="mb-6 text-4xl font-bold text-center text-gray-800">Hr 4 Login</h2>
          {error && <p className="bg-red-600 text-white p-2 rounded-md text-center mb-4">{error}</p>}
          {success && <p className="bg-green-600 text-white p-2 rounded-md text-center mb-4">{success}</p>}
          <div className="relative mb-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              required
            />
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500 text-xl" />
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              required
            />
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500 text-xl" />
          </div>
          {loading ? (
            <button
              disabled
              className="p-4 w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl 
                shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-all duration-300
                text-base font-semibold flex items-center justify-center space-x-4"
            >
              <MetroSpinner size={20} color="white" loading={true} />
              <span className="ml-2">Logging in...</span>
            </button>
          ) : (
            <button
              type="submit"
              className="p-4 w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl 
                shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-all duration-300
                hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.4)] text-base font-semibold
                flex items-center justify-center space-x-4 overflow-hidden relative
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                before:via-white before:to-transparent before:opacity-20 before:hover:translate-x-full
                before:transition-transform before:duration-700"
            >
              Login
            </button>
          )}
          <p className="mt-4 text-center text-gray-600">
            <a href="/ForgotPassword" className="text-teal-600 font-semibold hover:underline">
              Forgot Password?
            </a>
          </p>
        </form>
      </div>
      <div className={`hidden md:flex items-center justify-center w-1/2 p-10 transition-all duration-1000 ${fadeInText ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
        <div className="text-center p-6 rounded-lg">
          <img src={layoutImage} alt="JJM Layout" className="w-40 h-40 mx-auto mb-4 rounded-lg shadow-lg" />
          <h1 className="text-5xl font-extrabold text-gray-900">JJM MANUFACTURING</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900">Basta Best Quality, JJM na yan!</p>
          <p className="mt-2 text-lg text-gray-900">Secure Admin Access to HR4</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;