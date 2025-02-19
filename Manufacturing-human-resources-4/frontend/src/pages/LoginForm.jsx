import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSucces] = useState('')
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:7688/api/auth/login",
  //       formData
  //     );
  //     const {accessToken} = response.data.token;

  //     if (response.data.message === "Success") { // ✅ Match the response structure
  //       alert("Login successful!");
  //       localStorage.setItem("token", accessToken);
  //       navigate("/dashboard"); // ✅ Redirect to home page
  //     } else {
  //       alert(response.data.message); // ✅ Display correct error message
  //     }
  //   } catch (error) {
  //     console.error("Login Error:", error);
  //     alert("Invalid username or password. Please try again.");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try{
      const response = await axios.post("http://localhost:7688/api/auth/login",formData)
      if(response.data.success) {
        const { accessToken } = response.data
        sessionStorage.setItem("accessToken", accessToken);
        setSucces(response.data.message)
        setTimeout(()=>{
          setSucces(null)
          navigate("/dashboard");
        },2000)
      }
    }catch(error){
      setError(error.response.data.message || error.message)
      setTimeout (()=>{
        setError(null)
      },2000)
    }
    finally{
      setLoading(false)
    }


  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#afdceb" }}>
      {/* Login form on the left side */}
      <div className="flex justify-center items-center w-1/2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-96 p-6 border rounded-lg shadow-lg bg-white"
        >
          {error && <span className="bg-red-600 flex justify-center items-center "> {error}</span>}
          {success && <span>{success}</span>}
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
            Login
          </h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="mt-4 p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200 text-center"
          >
            Login
          </button>
          {/* No account prompt */}
          <p className="mt-4 text-center text-gray-600">
            No account yet?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up here.
            </Link>
          </p>
          {/* Forgot password prompt */}
          <p className="mt-2 text-center text-gray-600">
            <Link
              to="/ForgotPassword"
              className="text-blue-600 font-semibold hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>
      {/* Right side text with tagline */}
      <div className="flex items-center justify-center w-1/2 p-10">
        <div className="text-center">
          <h1
            className="text-6xl font-extrabold text-gray-800 leading-tight"
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}
          >
            HUMAN RESOURCES 4 MANAGEMENT
          </h1>
          <p
            className="mt-4 text-xl text-gray-600"
            style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)" }}
          >
            Your partner in innovative solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
