import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa"; 
import layoutImage from "../Components/Assets/layout.jpg";
 // Import your image


 const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
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

    setTimeout(async () => {
      try {
        const response = await axios.post("http://localhost:7688/api/auth/login", formData);
        if (response.data.success) {
          const { accessToken } = response.data;
          sessionStorage.setItem("accessToken", accessToken);
          setSuccess(response.data.message);
          setTimeout(() => {
            setSuccess(null);
            navigate("/dashboard");
          }, 2000);
        }
      } catch (error) {
        setError(error.response.data.message || error.message);
        setTimeout(() => {
          setError(null);
        }, 2000);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center text-gray-700">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full mb-4"></div>
          <h2 className="text-3xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-200">
      <div
        className={`flex justify-center items-center w-full md:w-1/2 p-10 transform transition-opacity duration-1000 ${fadeInForm ? 'opacity-100' : 'opacity-0'}`}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-sm p-8 bg-white shadow-xl rounded-lg"
        >
          {error && (
            <span className="bg-red-600 text-white flex justify-center items-center p-2 rounded-md mb-4">
              {error}
            </span>
          )}
          {success && (
            <span className="bg-green-600 text-white flex justify-center items-center p-2 rounded-md mb-4">
              {success}
            </span>
          )}

          <h2 className="mb-6 text-4xl font-semibold text-center text-gray-700">
            Login to HR4
          </h2>

          <div className="relative mb-6">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-4 pl-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              required
            />
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500" />
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 pl-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
              required
            />
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500" />
          </div>

          {loading ? (
            <div className="flex justify-center items-center mb-4">
              <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-700 rounded-full"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="mt-4 p-4 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 transition duration-300 transform hover:scale-105"
            >
              Login
            </button>
          )}

          <p className="mt-4 text-center text-gray-600">
            No account yet?{" "}
            <Link
              to="/signup"
              className="text-teal-600 font-semibold hover:underline"
            >
              Sign up here.
            </Link>
          </p>

          <p className="mt-2 text-center text-gray-600">
            <Link
              to="/ForgotPassword"
              className="text-teal-600 font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>

      <div
        className={`hidden md:flex items-center justify-center w-1/2 p-10 transition-all duration-1000 ${fadeInText ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
      >
        <div className="text-center p-6 rounded-lg">
          {/* Small Image */}
          <img
            src={layoutImage}
            alt="JJM Layout"
            className="w-32 h-32 mx-auto mb-4 rounded-lg shadow-md"
          />
          
          <h1 className="text-5xl font-extrabold text-gray-900">
            JJM MANUFACTURING
          </h1>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
          Basta Best Quality and Best Brand JJM na Yan!
          </p>
          <p className="mt-2 text-lg text-gray-900">
            Welcome to HR4, your partner in soap innovation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;