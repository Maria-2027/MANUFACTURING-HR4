import React from 'react';

const RequestInsight = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Request Insight</h1>
        <p className="text-lg text-gray-600 mb-6">This feature is currently under maintenance.</p>
        <p className="text-md text-gray-500 mb-6">
          We are working on integrating it with other departments to provide enhanced insights.
          Please check back later.
        </p>

        <div className="animate-pulse mt-6">
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
        </div>

        <p className="mt-6 text-gray-400">Thank you for your patience!</p>
      </div>
    </div>
  );
};

export default RequestInsight;
