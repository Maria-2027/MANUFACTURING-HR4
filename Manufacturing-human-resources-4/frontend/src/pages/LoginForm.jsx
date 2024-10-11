import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username); // Simulate login
      // Reset the form
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#afdceb' }}>
      {/* Login form on the left side */}
      <div className="flex justify-center items-center w-1/2">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-96 p-6 border rounded-lg shadow-lg bg-white"
        >
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Link
            to="/dashboard"
            type="submit"
            className="mt-4 p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-200 text-center"
          >
            Login
          </Link>
          {/* No account prompt */}
          <p className="mt-4 text-center text-gray-600">
            No account yet?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign up here.
            </Link>
          </p>
          {/* Forgot password prompt */}
          <p className="mt-2 text-center text-gray-600">
            <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">
              Forgot Password?
            </Link>
          </p>
        </form>
      </div>
      {/* Right side text with tagline */}
      <div className="flex items-center justify-center w-1/2 p-10">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-gray-800 leading-tight" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            HUMAN RESOURCES 4 MANAGEMENT
          </h1>
          <p className="mt-4 text-xl text-gray-600" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
            Your partner in innovative solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;