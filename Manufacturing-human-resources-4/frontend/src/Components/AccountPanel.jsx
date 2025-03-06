import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserShield } from "react-icons/fa"; // Importing icons



const LoginChoice = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showText, setShowText] = useState(false); // To control when the text will appear

  // Simulate loading time of 2 seconds before showing the login options
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowText(true); // After loading, show the text with slide effect
    }, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center">
          {/* Loading Spinner */}
          <div className="animate-spin border-t-4 border-teal-600 border-8 w-16 h-16 rounded-full border-solid border-transparent mb-4"></div>
          <p className="text-lg text-gray-700 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left side: Login Buttons */}
      <div className="flex flex-col justify-center items-center w-full sm:w-1/2 p-8 space-y-6">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-800 mb-6">
          Select Your Login Role
        </h2>

        <div className="w-full flex flex-col space-y-4">
          {/* Employee Login Option */}
          <button
            onClick={() => navigate("/login")} // Direct navigation to login
            className="p-5 w-full bg-teal-600 text-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xl font-semibold flex items-center justify-center space-x-4"
          >
            <FaUser className="text-2xl" />
            <span>Login as Employee</span>
          </button>

          {/* Admin Login Option */}
          <button
            onClick={() => navigate("/admin")}
            className="p-5 w-full bg-teal-600 text-white rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 text-xl font-semibold flex items-center justify-center space-x-4"
          >
            <FaUserShield className="text-2xl" />
            <span>Login as Admin</span>
          </button>
        </div>
      </div>

      {/* Right side: JJM Manufacturing Text */}
      <div className="flex justify-center items-center w-full sm:w-1/2 p-10">
        <div
          className={`text-center transition-all transform duration-1000 ${
            showText ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
            JJM MANUFACTURING
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-semibold text-gray-800">
            Innovation with Quality!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginChoice;
