import React, { useState } from 'react';

const RequestCompensationDetails = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [detailsRequested, setDetailsRequested] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Simulate a form submission (e.g., API call)
    try {
      console.log('Request Submitted:', { employeeId, detailsRequested });
      setMessage('Request submitted successfully!');
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
      setEmployeeId('');
      setDetailsRequested('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4">Request Employee Compensation Details</h1>
        {message && <div className="text-green-600 text-center mb-2">{message}</div>}
        {error && <div className="text-red-600 text-center mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID:</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
              className="mt-1 block w-full border border-blue-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 ease-in-out"
            />
          </div>
          <div>
            <label htmlFor="detailsRequested" className="block text-sm font-medium text-gray-700">Details Requested:</label>
            <textarea
              id="detailsRequested"
              value={detailsRequested}
              onChange={(e) => setDetailsRequested(e.target.value)}
              required
              className="mt-1 block w-full border border-blue-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-150 ease-in-out"
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-2 px-4 font-semibold text-white rounded-md transition duration-200 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestCompensationDetails;
