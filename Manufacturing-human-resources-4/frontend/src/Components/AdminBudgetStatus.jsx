import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaSearch } from "react-icons/fa";

const BUDGETSTATUS = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/api/budget-requests/updateStatusFinance"
    : "https://backend-hr4.jjm-manufacturing.com/api/budget-requests/updateStatusFinance";

const AdminBudgetStatus = () => {
  const [budgetRequests, setBudgetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBudgetRequests();
  }, []);

  const fetchBudgetRequests = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');
        const response = await axios.post(
          BUDGETSTATUS,
          {}, // empty body
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data) setBudgetRequests(response.data);
        setLoading(false);
    } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch budget requests");
        setLoading(false);
    }
};

const updateBudgetStatus = async (approvalId, newStatus) => {
    // Validate required fields
    if (!approvalId || !newStatus) {
        alert("Approval ID and status are required");
        return;
    }

    try {
        const token = sessionStorage.getItem('accessToken');
        const response = await axios.post(
            `${BUDGETSTATUS}/api/budget-requests/updateStatusFinance`,
            { approvalId, status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.message === "Budget request updated successfully") {
            fetchBudgetRequests(); // Refresh list after update
            alert(`Budget request ${newStatus.toLowerCase()} successfully`);
        }
    } catch (err) {
        console.error("Update Budget Error:", err);
        alert(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} budget request`);
    }
};

  // Enhanced filter function to search by approval ID
  const filteredBudgetRequests = budgetRequests.filter(request =>
    request._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Enhanced Search Section */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaMoneyBillWave className="text-3xl text-green-600 mr-3" />
            <h1 className="text-3xl font-bold">Budget Status Dashboard</h1>
          </div>
          
          {/* Prominent Search Bar */}
          <div className="w-1/3 min-w-[300px]">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Approval ID or Status..."
                className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBudgetRequests.map((request) => (
                <tr key={request._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {request._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{request.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₱{request.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">{request.purpose}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateBudgetStatus(request._id, 'Approved')}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateBudgetStatus(request._id, 'Rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBudgetRequests.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No budget requests found matching the search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBudgetStatus;
