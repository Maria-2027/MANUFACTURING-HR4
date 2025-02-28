import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import layoutImage from "../Components/Assets/layout.jpg"; // Company Branding Image

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    username: "",
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
    setTimeout(() => {
      setSuccess("Login Successful. Redirecting...");
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 2000);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center text-gray-700">
          <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full mb-4"></div>
          <h2 className="text-3xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`flex justify-center items-center w-full md:w-1/2 p-10 transform transition-opacity duration-1000 ${fadeInForm ? "opacity-100" : "opacity-0"}`}>
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md p-8 bg-white shadow-2xl rounded-lg border border-gray-200">
          <h2 className="mb-6 text-4xl font-bold text-center text-gray-800">Admin Login</h2>
          {error && <p className="bg-red-600 text-white p-2 rounded-md text-center mb-4">{error}</p>}
          {success && <p className="bg-green-600 text-white p-2 rounded-md text-center mb-4">{success}</p>}
          <div className="relative mb-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
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
            <div className="flex justify-center items-center mb-4">
              <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-gray-700 rounded-full"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="mt-4 p-4 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300 transform hover:scale-105"
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
