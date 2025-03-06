import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const REGISTER = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/signup"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/signup";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "employee", // Default role
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post(
        `${REGISTER}/api/auth/signup`,
        formData
      );
      setMessage(response.data.message);

      setFormData({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        role: "employee", // Reset to default
      });

      alert("User Created Successfully");
      navigate("/login");
    } catch (error) {
      setIsError(true);
      if (error.response) {
        setMessage(error.response.data.message || "An error occurred during registration");
      } else if (error.request) {
        setMessage("No response received from the server. Please try again later.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-200"> {/* Light gray background */}
      {/* Left Side: Register Form */}
      <div className="flex justify-center items-center w-full md:w-1/3 p-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-md p-6 border rounded-lg shadow-lg bg-white"
        >
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">
            Register
          </h2>
          {isError && <p className="bg-red-600 text-white p-2 rounded">{message}</p>}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="flex space-x-2">
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 w-1/2"
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 w-1/2"
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div className="mb-3">
            <label className="text-gray-900 font-semibold">Role: </label>
            <select
              name="role"
              className="form-select p-3 w-full border border-gray-300 rounded-md text-gray-900"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="mt-4 p-3 bg-teal-600 text-white rounded-md shadow-md hover:bg-teal-700 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>

      {/* Right Side: Text Description */}
      <div className="hidden md:flex justify-center items-center w-full md:w-2/3 px-6 py-8">
        <div className="text-center p-6 rounded-lg">
          <h1 className="text-4xl font-extrabold text-gray-900">JJM Manufacturing</h1>
          <p className="text-xl font-semibold text-gray-900 mt-4">
            Join our team and be part of a fast-growing manufacturing company.
          </p>
          <p className="text-lg text-gray-900 mt-2">
            Sign up now to access our innovative systems and become a valued
            member of JJM Manufacturing.
          </p>
          <p className="text-lg text-gray-900 mt-4">
            Ready to get started? Create your account today and unlock your
            full potential.
          </p>
          <p className="text-lg text-gray-900 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-teal-600 font-semibold hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
