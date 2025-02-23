import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaTasks, FaRegComment, FaUsers } from 'react-icons/fa';

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
      const hours = now.getHours();
      if (hours < 12) {
        setGreeting('Good Morning');
      } else if (hours < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-800 mb-4"></div>
          <p className="text-gray-800 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-pink-50 min-h-screen flex flex-col items-center justify-center space-y-12 px-6">
      {/* Hero Section */}
      <div className="text-center p-10 bg-white shadow-2xl rounded-3xl max-w-3xl space-y-6 animate__animated animate__fadeIn animate__delay-1s">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">{greeting}</h1>
        <p className="text-xl text-gray-600">
          Welcome to JJM Manufacturing's Employee HR Portal! Here, you can manage your work tasks, view company updates, and stay engaged with the team.
        </p>

        {/* Time Section */}
        <div className="text-lg text-gray-600">
          <p>Current Time:</p>
          <p className="font-mono text-xl text-gray-900">{currentTime}</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
          <FaUsers className="text-4xl text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Grievance Management</h3>
          <p className="text-gray-600">Submit and resolve employee grievances in a confidential and efficient manner, ensuring fair treatment for all employees.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
          <FaUserAlt className="text-4xl text-green-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Employee Engagement</h3>
          <p className="text-gray-600">Engage with employees through feedback, surveys, and activities that help improve morale and overall job satisfaction.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
          <FaRegComment className="text-4xl text-purple-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Employee Communication</h3>
          <p className="text-gray-600">Maintain open channels of communication between management and employees, fostering a culture of transparency and trust.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out">
          <FaTasks className="text-4xl text-orange-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Workforce Analytics</h3>
          <p className="text-gray-600">Analyze employee performance and data to make informed decisions and enhance workforce productivity and efficiency.</p>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-white py-12 w-full rounded-3xl shadow-lg mt-16 animate__animated animate__fadeIn animate__delay-3s">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">What Our Employees Say</h2>
          <p className="text-lg text-gray-600 mb-4">Here's what our employees have to say about working at JJM Manufacturing:</p>
        </div>
        <div className="flex justify-center gap-12">
          <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">"Working at JJM Manufacturing has been a fantastic experience. The company truly cares about its employees!"</p>
            <p className="text-gray-800 font-semibold mt-4">John Doe</p>
            <p className="text-gray-500">Production Manager</p>
          </div>
          <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">"The work environment at JJM is amazing! The company makes sure we have everything we need to succeed."</p>
            <p className="text-gray-800 font-semibold mt-4">Jane Smith</p>
            <p className="text-gray-500">HR Specialist</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 w-full">
        <div className="text-center">
          <p className="text-lg">© 2025 JJM Manufacturing. All rights reserved.</p>
          <div className="mt-4">
            <a href="#!" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a> | 
            <a href="#!" className="text-gray-400 hover:text-white transition duration-300"> Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
