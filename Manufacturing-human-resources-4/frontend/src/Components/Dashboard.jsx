import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [loading, setLoading] = useState(true); // State to manage loading
  const [currentTime, setCurrentTime] = useState(''); // State to manage current time
  const [greeting, setGreeting] = useState(''); // State to manage greeting

  // Simulate a loading time of 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 2000); // Adjust the loading time as needed

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, []);

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString()); // Update the current time with date and time

      // Set greeting based on current hour
      const hours = now.getHours();
      if (hours < 12) {
        setGreeting('Good Morning');
      } else if (hours < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    }, 1000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  if (loading) {
    // Show loading spinner with new design while loading
    return (
      <div className="container mx-auto p-8 bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="text-center p-8 bg-white bg-opacity-90 shadow-xl rounded-lg max-w-md">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 animate-bounce">
          {greeting}
        </h1>
        <p className="text-xl text-gray-700">
          Your hub for effective communication and collaboration.
        </p>
        <p className="mt-6 text-gray-600 leading-relaxed">
          Stay updated with the latest announcements and connect with your team!
        </p>
        <div className="mt-4 text-gray-600 text-xl">
          <p>Current Date and Time:</p>
          <p className="font-mono">{currentTime}</p> {/* Display current date and time inside the box */}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
