import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';

const ComplaintPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    complaint: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize loading state to true
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate a loading time of 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    console.log('Form Data Submitted: ', formData);

    // Simulate form submission with a timeout
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulating network delay
    setSubmitted(true);
    setLoading(false); // End loading

    // You can navigate or do something else here if needed
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  return (
    <div className="container mx-auto p-8 bg-gray-200 min-h-screen flex items-center justify-center">
      {loading ? ( // Show loading spinner when loading
        <div className="flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading...</p>
        </div>
      ) : submitted ? (
        <div className="bg-green-100 text-green-700 font-semibold p-4 rounded-lg text-center mb-6">
          Thank you for submitting your complaint. We will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
          {/* Title and Description Inside the Form */}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">Employee Complaint Page</h1>
          <p className="mb-4 text-lg text-gray-600 text-center">We value your feedback. Please fill out the form below to submit your complaint.</p>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold text-lg mb-2" htmlFor="complaint">
              Complaint
            </label>
            <textarea
              id="complaint"
              name="complaint"
              value={formData.complaint}
              onChange={handleInputChange}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Describe your issue"
              rows="5"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0112 0H4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Complaint'
              )}
            </button>

            <button
              type="button"
              onClick={handleBackClick}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ComplaintPage;
