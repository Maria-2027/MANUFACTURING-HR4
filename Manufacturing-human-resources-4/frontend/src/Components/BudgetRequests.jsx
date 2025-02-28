import React, { useState } from "react";

const BudgetRequests = () => {
  const [department, setDepartment] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [notification, setNotification] = useState("");
  const [requests, setRequests] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      Department: department,
      Amount: amount,
      Reason: reason,
      RequestTime: new Date().toLocaleString(),
      Status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:7688/api/auth/budget-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification("Budget request successfully submitted!");
        // Update the table with the new request
        setRequests((prevRequests) => [...prevRequests, formData]);
      } else {
        setNotification("Error: " + data.error);
      }
    } catch (error) {
      setNotification("Server error, please try again.");
    }

    // Reset form after submission
    setDepartment("");
    setAmount("");
    setReason("");

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-xl flex flex-wrap">
      <div className="w-full lg:w-2/3 mb-8">
        <h1 className="text-4xl font-semibold text-center mb-6">Submit Your Budget Request</h1>

        {notification && (
          <div className="p-4 text-center text-white bg-green-600 rounded-lg mb-6 shadow-lg">
            {notification}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Department</label>
            <input
              type="text"
              placeholder="Enter your department"
              className="w-full sm:w-3/4 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 ease-in-out shadow-lg"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>

          {/* Requested Amount Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Requested Amount</label>
            <input
              type="number"
              placeholder="Enter the requested amount"
              className="w-full sm:w-3/4 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 ease-in-out shadow-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Reason for Request Field */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Reason for Request</label>
            <input
              type="text"
              placeholder="Enter the reason for the budget request"
              className="w-full sm:w-3/4 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 ease-in-out shadow-lg"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full sm:w-3/4 bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
          >
            Submit Budget Request
          </button>
        </form>
      </div>

      {/* Table Section */}
      <div className="w-full lg:w-1/3 pl-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Request Status</h2>
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-left">Time</th>
              <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-2 py-1">{request.RequestTime}</td>
                <td className="border border-gray-300 px-2 py-1">{request.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetRequests;
