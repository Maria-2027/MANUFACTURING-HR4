import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const BUDGETREQUESTS_API = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/budget-requests/get-all"
  : "https://backend-hr4.jjm-manufacturing.com/api/budget-requests/get-all";

const BudgetRequestsList = () => {
  const [budgetRequests, setBudgetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');  // Changed to single search term
  const [currentPage, setCurrentPage] = useState(1  );
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 7;

  const fetchBudgetRequests = async () => {
    try {
      const response = await axios.get(BUDGETREQUESTS_API);
      if (response.data.success) {
        console.log('Budget Requests Data:', response.data.data); // Add this line for debugging
        setBudgetRequests(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch budget requests');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to fetch budget requests');
      console.error('Error fetching budget requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetRequests();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredResults = budgetRequests.filter((request) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      formatDate(request.createdAt).toLowerCase().includes(searchStr) ||
      request.comment?.toLowerCase().includes(searchStr) ||
      request.reason?.toLowerCase().includes(searchStr) ||
      request.status?.toLowerCase().includes(searchStr) ||
      request.totalBudget?.toString().toLowerCase().includes(searchStr)
    );
  });

  const handleSort = (field) => {
    if (field !== 'createdAt') return; // Only allow sorting for createdAt

    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedData = [...budgetRequests].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setBudgetRequests(sortedData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (filteredResults.length > 0 ? filteredResults : budgetRequests).slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    (filteredResults.length > 0 ? filteredResults : budgetRequests).length / itemsPerPage
  );

  const renderSortIcon = (field) => {
    if (field !== 'createdAt') return null; // Only show sort icon for createdAt
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Budget Requests</h2>

      {error && <div className="bg-red-500 text-white px-6 py-3 rounded-lg mb-4">{error}</div>}

      <div className="relative flex-1 max-w-md mb-6">
        <input
          type="text"
          placeholder="Search budget requests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pl-12 pr-4 bg-white border-2 border-gray-300 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out shadow-lg hover:shadow-xl"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              {['createdAt', 'totalBudget', 'reason', 'comment', 'documents', 'status'].map((field) => (
                <th 
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`px-6 py-3 border ${field === 'createdAt' ? 'cursor-pointer hover:bg-gray-200' : 'cursor-default'} transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{field === 'createdAt' ? 'Date Created' : field.replace(/([A-Z])/g, ' $1').trim()}</span>
                    {renderSortIcon(field) && <span className="ml-2">{renderSortIcon(field)}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-6 py-3 border max-w-[180px]">
                  {formatDate(request.createdAt)}
                </td>
                <td className="px-6 py-3 border max-w-[150px]">
                  {typeof request.totalBudget === 'number' ? request.totalBudget.toLocaleString() : request.totalBudget}
                </td>
                <td className="px-6 py-3 border max-w-[250px] group relative">
                  <div className="truncate" title={request.reason}>
                    {request.reason}
                  </div>
                  <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white p-2 rounded-lg shadow-lg -mt-1 left-0 max-w-md">
                    {request.reason}
                  </div>
                </td>
                <td className="px-6 py-3 border max-w-[250px] group relative">
                  <div className="truncate" title={request.comment}>
                    {request.comment}
                  </div>
                  <div className="hidden group-hover:block absolute z-10 bg-gray-800 text-white p-2 rounded-lg shadow-lg -mt-1 left-0 max-w-md">
                    {request.comment}
                  </div>
                </td>
                <td className="px-6 py-3 border">
                  <a 
                    href={request.documents} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Document
                  </a>
                </td>
                <td className="px-6 py-3 border max-w-[150px]">
                  <div className="truncate" title={request.status}>
                    {request.status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-3 py-1">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BudgetRequestsList;
