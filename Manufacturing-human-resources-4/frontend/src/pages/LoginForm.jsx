import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import layoutImage from "../Components/Assets/layout.jpg"; // Company Branding Image
import axios from 'axios'; // Import axios
import { MetroSpinner } from 'react-spinners-kit';

const EMPLOYEELOGIN = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/testLog"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/testLog";

const EmployeeLogin = () => {
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
    
    try {
      const response = await axios.post(EMPLOYEELOGIN, formData);
      
      if (response.data && response.data.token) {
        // Check if user has Employee role
        if (response.data.user.role !== "Employee") {
          throw new Error("Access denied. Only Employees can login here.");
        }

        // Store token and user data
        sessionStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        
        // Set axios default header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center text-gray-700">
          <SyncLoader cssOverride={{}} loading color="#000000" margin={12} size={15} speedMultiplier={0.5} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`flex justify-center items-center w-full md:w-1/2 p-10 transform transition-opacity duration-1000 ${fadeInForm ? "opacity-100" : "opacity-0"}`}>
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md p-8 bg-white shadow-2xl rounded-lg border border-gray-200">
          <h2 className="mb-6 text-4xl font-bold text-center text-gray-800">Employee Login</h2>
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
          <button
            type="submit"
            disabled={loading}
            className={`p-4 w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl 
              shadow-lg transition-all duration-300 text-base font-semibold
              flex items-center justify-center space-x-4
              ${loading ? 'opacity-90' : 'hover:shadow-xl hover:translate-y-[-2px]'}`}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <MetroSpinner size={20} color="white" loading={true} />
                <span>Processing...</span>
              </span>
            ) : (
              'Login'
            )}
          </button>
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
          <p className="mt-2 text-lg text-gray-900">Employee Access to HR4</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;