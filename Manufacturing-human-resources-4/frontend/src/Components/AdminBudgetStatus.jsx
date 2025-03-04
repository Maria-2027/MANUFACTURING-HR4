import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoneyBillWave } from "react-icons/fa";

const AdminBudgetStatus = () => {
  const [budgetRequests, setBudgetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBudgetRequests();
  }, []);

  const fetchBudgetRequests = async () => {
    try {
        const token = sessionStorage.getItem('accessToken');
        const response = await axios.post("http://localhost:7688/api/budget-requests/updateStatusFinance", {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data) setBudgetRequests(response.data);
        setLoading(false);
    } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch budget requests");
        setLoading(false);
    }
};

const updateBudgetStatus = async (approvalId, newStatus) => {
    try {
        const token = sessionStorage.getItem('accessToken');
        const response = await axios.put(
            `http://localhost:7688/api/budget-requests/update`, // Tama na endpoint
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



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaMoneyBillWave className="text-3xl text-green-600 mr-3" />
        <h1 className="text-3xl font-bold">Budget Status Dashboard</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
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
              {budgetRequests.map((request) => (
                <tr key={request._id}>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBudgetStatus;
