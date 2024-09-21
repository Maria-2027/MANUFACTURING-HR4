import React from "react";

const WelcomePage = () => {
  return (
    <div className="bg-gray-200 text-black h-screen flex flex-col items-center justify-center p-5">
      <h1 className="text-4xl font-bold mb-4">Welcome to the JJM Company</h1>
      <p className="text-lg mb-6 text-gray-700">
        We're glad to have you here. Explore the features and manage your data with ease.
      </p>
      <button className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg transition-transform transform hover:scale-105">
        Get Started
      </button>
    </div>
  );
};

export default WelcomePage;
