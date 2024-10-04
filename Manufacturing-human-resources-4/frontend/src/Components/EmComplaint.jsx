import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ComplaintPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    complaint: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted: ', formData);
    setSubmitted(true);
    // Add your form submission logic here
  };

  const handleBackClick = () => {
    navigate(-1); // This will navigate back to the previous page
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-lg shadow-xl">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Employee Complainant Page</h1>
      <p className="mb-8 text-lg text-gray-600 text-center">We value your feedback. Please fill out the form below to submit your complaint.</p>

      {submitted ? (
        <div className="bg-green-100 text-green-700 font-semibold p-4 rounded-lg text-center mb-6">
          Thank you for submitting your complaint. We will get back to you shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Submit Complaint
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
