import React, { useState, useEffect } from "react";
import { FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaRegClipboard } from "react-icons/fa";
import layout from "./Assets/layout.jpg";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AdminBudgetRequest from "./AdminBudgetRequest";
import AdminBudgetStatus from "./AdminBudgetStatus";

const ADMINSUGGESTION = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/employee-suggestions"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/employee-suggestions";

const FEEDBACK = process.env.NODE_ENV === "development" 
  ? "http://localhost:7688/api/auth/adminfeedback"	  
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/adminfeedback"; 

const DECLINEDSUGGESTION = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/adminfeedback"	  
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/adminfeedback"; 

const AdminEmployeeSuggestion = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("Employee Suggestions");
  const [activeContent, setActiveContent] = useState("Employee Suggestions");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state for API requests
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [viewMode, setViewMode] = useState('all'); // 'all', 'approved', 'rejected'
  const [implementationStatus, setImplementationStatus] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categoryStats, setCategoryStats] = useState({});
  const rowsPerPage = 8;
  const navigate = useNavigate();

  // Update categoryLabels object with more organized categories
  const categoryLabels = {
    'work-efficiency': 'Work Efficiency',
    'process-improvement': 'Process Improvement',
    'safety': 'Safety & Health',
    'training': 'Training & Development',
    'workplace': 'Workplace Environment',
    'tools': 'Tools & Equipment',
    'communication': 'Communication',
    'cost-saving': 'Cost Saving',
    'quality': 'Quality Improvement',
    'other': 'Other'
  };

  // Add this helper function
  const getCategoryLabel = (categoryValue) => {
    return categoryLabels[categoryValue] || categoryValue;
  };

  // Add this function to calculate category statistics
  const calculateCategoryStats = (suggestions) => {
    const stats = {};
    Object.keys(categoryLabels).forEach(category => {
      stats[category] = {
        total: 0,
        approved: 0,
        declined: 0,
        pending: 0,
        implemented: 0
      };
    });

    suggestions.forEach(suggestion => {
      const category = suggestion.category || 'other';
      stats[category].total++;
      if (suggestion.status === 'APPROVED') stats[category].approved++;
      if (suggestion.status === 'DECLINED') stats[category].declined++;
      if (!suggestion.status) stats[category].pending++;
      if (suggestion.implementationStatus === 'COMPLETED') stats[category].implemented++;
    });

    setCategoryStats(stats);
  };

  // Add this helper function to format IDs
  const formatSuggestionId = (originalId) => {
    // Get a numeric hash from the MongoDB ID
    const numericHash = originalId
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Format as 6-digit number with leading zeros
    const formattedNumber = String(numericHash % 1000000).padStart(6, '0');
    return formattedNumber;
  };

  useEffect(() => {
    setLoading(true);
    const endpoint = viewMode === 'rejected' ? DECLINEDSUGGESTION : ADMINSUGGESTION;
    
    axios
      .get(endpoint)
      .then((response) => {
        const sortedSuggestions = response.data.sort(
          (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
        );
        // Create feedback status object
        const feedbackObj = {};
        sortedSuggestions.forEach(suggestion => {
          feedbackObj[suggestion._id] = suggestion.feedback || '';
        });
        setFeedbackStatus(feedbackObj);
        setSuggestions(sortedSuggestions);
        calculateCategoryStats(sortedSuggestions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
        setLoading(false);
      });
  }, [viewMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleStatusUpdate = async (id, action, employeeId) => {
    const currentSuggestion = suggestions.find(s => s._id === id);
    setSelectedSuggestion({
      _id: id,
      status: action,
      employeeId: employeeId,
      suggestion: currentSuggestion.suggestion, // Add the suggestion text
      dateSubmitted: currentSuggestion.dateSubmitted,
      fullName: currentSuggestion.fullName  // Add this line
    });
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    try {
      setLoading(true);
      const action = selectedSuggestion.status;

      // Create feedback data with required fields
      const feedbackData = {
        suggestionId: selectedSuggestion._id, // Add required suggestionId
        employeeId: selectedSuggestion.employeeId,
        status: action,
        feedback: feedback,
        suggestion: selectedSuggestion.suggestion,
        dateSubmitted: selectedSuggestion.dateSubmitted,
        fullName: selectedSuggestion.fullName
      };

      // Send feedback to the feedback endpoint
      await axios.post(FEEDBACK, feedbackData);

      // Update suggestion status
      const updateData = {
        status: action,
        feedback: feedback,
        employeeId: selectedSuggestion.employeeId,
        updatedAt: new Date().toISOString()
      };

      const response = await axios.put(
        `${ADMINSUGGESTION}/${selectedSuggestion._id}`,
        updateData
      );

      if (response.status === 200) {
        setSuggestions(prevSuggestions =>
          prevSuggestions.map(suggestion =>
            suggestion._id === selectedSuggestion._id
              ? { ...suggestion, ...updateData }
              : suggestion
          )
        );
        setFeedbackStatus(prevFeedbackStatus => ({
          ...prevFeedbackStatus,
          [selectedSuggestion._id]: feedback
        }));
        alert('Feedback submitted successfully');
      }
      
      setShowFeedbackModal(false);
      setFeedback("");
      setSelectedSuggestion(null);
    } catch (error) {
      console.error("Error submitting feedback:", error.response?.data || error.message);
      alert("Failed to submit feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleImplementationUpdate = async (suggestionId, status) => {
    try {
      // Update implementation status locally
      setImplementationStatus(prev => ({
        ...prev,
        [suggestionId]: status
      }));
      
      // Here you would typically update the backend
      await axios.put(`${ADMINSUGGESTION}/${suggestionId}`, {
        implementationStatus: status
      });
      
      alert('Implementation status updated successfully');
    } catch (error) {
      console.error('Error updating implementation status:', error);
      alert('Failed to update implementation status');
    }
  };

  const themeClasses = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100";

  const filteredSuggestions = suggestions.filter((suggestion) => {
    const searchQuery = searchTerm.toLowerCase().trim();
    const matchesSearch = searchQuery === '' || (
      suggestion.fullName?.toLowerCase().includes(searchQuery) ||
      suggestion.suggestion?.toLowerCase().includes(searchQuery) ||
      suggestion.category?.toLowerCase().includes(searchQuery) ||
      suggestion.feedback?.toLowerCase().includes(searchQuery) ||
      formatSuggestionId(suggestion._id).includes(searchQuery) ||
      suggestion.status?.toLowerCase().includes(searchQuery)
    );
    
    const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory;
    
    switch(viewMode) {
      case 'approved':
        return matchesSearch && matchesCategory && suggestion.status === 'APPROVED';
      case 'rejected':
        return matchesSearch && matchesCategory && suggestion.status === 'DECLINED';
      default:
        return matchesSearch && 
               matchesCategory && 
               suggestion.dateSubmitted.split('T')[0] === selectedDate && 
               suggestion.status !== 'DECLINED' && 
               suggestion.status !== 'APPROVED';
    }
  });

  const indexOfLastSuggestion = currentPage * rowsPerPage;
  const indexOfFirstSuggestion = indexOfLastSuggestion - rowsPerPage;
  const currentSuggestions = filteredSuggestions.slice(indexOfFirstSuggestion, indexOfLastSuggestion);

  const totalPages = Math.ceil(filteredSuggestions.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1); // Reset to first page when date changes
  };

  const renderViewModeButtons = () => (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={() => setViewMode('all')}
        className={`px-4 py-2 rounded-md transition-colors ${
          viewMode === 'all' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        All Suggestions
      </button>
      <button
        onClick={() => setViewMode('approved')}
        className={`px-4 py-2 rounded-md transition-colors ${
          viewMode === 'approved' 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Show Approved List
      </button>
      <button
        onClick={() => setViewMode('rejected')}
        className={`px-4 py-2 rounded-md transition-colors ${
          viewMode === 'rejected' 
            ? 'bg-red-500 text-white' 
            : 'bg-gray-200 text-gray-700'
        }`}
      >
        Show Rejection List
      </button>
    </div>
  );

  const renderTableHeaders = () => (
    <tr>
      {viewMode !== 'all' ? (
        <>
          <th className="border border-gray-300 px-4 py-2">Employee Name</th>
          <th className="border border-gray-300 px-4 py-2">Category</th>
          <th className="border border-gray-300 px-4 py-2">Suggestion</th>
          <th className="border border-gray-300 px-4 py-2">Admin Feedback</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          {viewMode === 'approved' && (
            <th className="border border-gray-300 px-4 py-2">Implementation Status</th>
          )}
        </>
      ) : (
        <>
          <th className="border border-gray-300 px-4 py-2">ID</th>
          <th className="border border-gray-300 px-4 py-2">Employee Name</th>
          <th className="border border-gray-300 px-4 py-2">Category</th>
          <th className="border border-gray-300 px-4 py-2">Suggestion</th>
          <th className="border border-gray-300 px-4 py-2">Date Submitted</th>
          <th className="border border-gray-300 px-4 py-2">Status</th>
          <th className="border border-gray-300 px-4 py-2">Actions</th>
        </>
      )}
    </tr>
  );

  const renderCategoryFilter = () => (
    <div className="mb-4">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="p-2 rounded-md border border-gray-300"
      >
        <option value="all">All Categories</option>
        {Object.entries(categoryLabels).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      
      {/* Category Statistics */}
      {selectedCategory !== 'all' && categoryStats[selectedCategory] && (
        <div className="mt-2 grid grid-cols-4 gap-4">
          <div className="bg-blue-100 p-2 rounded">
            <div className="font-bold">Total</div>
            <div>{categoryStats[selectedCategory].total}</div>
          </div>
          <div className="bg-green-100 p-2 rounded">
            <div className="font-bold">Approved</div>
            <div>{categoryStats[selectedCategory].approved}</div>
          </div>
          <div className="bg-yellow-100 p-2 rounded">
            <div className="font-bold">Pending</div>
            <div>{categoryStats[selectedCategory].pending}</div>
          </div>
          <div className="bg-purple-100 p-2 rounded">
            <div className="font-bold">Implemented</div>
            <div>{categoryStats[selectedCategory].implemented}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTableRow = (suggestion, index) => (
    <tr key={index} className="text-center">
      {viewMode !== 'all' ? (
        <>
          <td className="border border-gray-300 px-4 py-2">{suggestion.fullName}</td>
          <td className="border border-gray-300 px-4 py-2">{getCategoryLabel(suggestion.category)}</td>
          <td className="border border-gray-300 px-4 py-2">{suggestion.suggestion}</td>
          <td className="border border-gray-300 px-4 py-2">{suggestion.feedback || 'No feedback provided'}</td>
          <td className="border border-gray-300 px-4 py-2">
            <span className={`px-2 py-1 rounded ${
              suggestion.status === 'APPROVED' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {suggestion.status}
            </span>
          </td>
          {viewMode === 'approved' && (
            <td className="border border-gray-300 px-4 py-2">
              <select 
                value={implementationStatus[suggestion._id] || 'NOT_STARTED'}
                onChange={(e) => handleImplementationUpdate(suggestion._id, e.target.value)}
                className="p-2 rounded-md border border-gray-300"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </td>
          )}
        </>
      ) : (
        <>
          <td className="border border-gray-300 px-4 py-2">
            {formatSuggestionId(suggestion._id)}
          </td>
          <td className="border border-gray-300 px-4 py-2">{suggestion.fullName}</td>
          <td className="border border-gray-300 px-4 py-2">{getCategoryLabel(suggestion.category)}</td>
          <td className="border border-gray-300 px-4 py-2">{suggestion.suggestion}</td>
          <td className="border border-gray-300 px-4 py-2">
            {new Date(suggestion.dateSubmitted).toLocaleDateString()}
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <div className="flex flex-col space-y-2">
              <span className={`px-2 py-1 rounded ${
                suggestion.status === 'APPROVED' 
                  ? 'bg-green-100 text-green-800' 
                  : suggestion.status === 'DECLINED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {suggestion.status || 'Pending'}
              </span>
              {feedbackStatus[suggestion._id] && (
                <span className="text-sm text-gray-600 italic">
                  Feedback: {feedbackStatus[suggestion._id]}
                </span>
              )}
            </div>
          </td>
          <td className="border border-gray-300 px-4 py-2">
            <div className="flex justify-center space-x-2">
              <button 
                onClick={() => handleStatusUpdate(suggestion._id, 'APPROVED', suggestion.employeeId)}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                disabled={loading}
              >
                ✓
              </button>
              <button 
                onClick={() => handleStatusUpdate(suggestion._id, 'DECLINED', suggestion.employeeId)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                disabled={loading}
              >
                ✕
              </button>
            </div>
          </td>
        </>
      )}
    </tr>
  );

  return (
    <div className={`flex h-screen ${themeClasses}`}>
      {/* Sidebar */}
      <aside className={`w-72 shadow-lg p-6 flex flex-col relative h-screen overflow-y-auto ${sidebarClasses}`}>
        <div className="flex justify-center mb-6">
          <img 
            src={layout} 
            alt="JJM Logo" 
            className="w-32 h-32 rounded-full cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigate('/admin-dashboard')}
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">JJM Admin Portal</h2>

        <nav className="flex-grow">
          <ul className="space-y-4">
            {[{ title: "Employee Grievances", icon: <FaExclamationCircle className="text-lg" />, link: "/admin-grievance" },
              { title: "Employee Suggestions", icon: <FaRegCommentDots className="text-lg" />, link: "/admin-employee-suggestion" },
              { title: "Communication Hub", icon: <FaEnvelope className="text-lg" />, link: "/admin-communication" },
              { title: "Workforce Analytics", icon: <FaChartBar className="text-lg" />, link: "/admin-workflow" },
              { title: "Audit Logs", icon: <FaRegClipboard className="text-lg" />, link: "/admin-audit-logs" }]
              .map((item, index) => (
                <li key={index} className={`p-3 rounded-md transition duration-200 ${activeTab === item.title ? "bg-blue-200 text-blue-600" : buttonHoverClasses}`}>
                  <Link to={item.link} className="flex items-center space-x-3" onClick={() => setActiveTab(item.title)}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${buttonHoverClasses} w-full`}
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Employee Suggestions & Budget Requests</h1>

        {/* Buttons for toggling content */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveContent("Employee Suggestions")}
            className={`p-3 rounded-md ${activeContent === "Employee Suggestions" ? "bg-blue-200 text-blue-600" : "bg-gray-200 text-gray-900"}`}
          >
            Employee Suggestions
          </button>
          <button
            onClick={() => setActiveContent("Budget Requests")}
            className={`p-3 rounded-md ${activeContent === "Budget Requests" ? "bg-blue-200 text-blue-600" : "bg-gray-200 text-gray-900"}`}
          >
            Budget Requests
          </button>
          <button
            onClick={() => setActiveContent("Budget Status")}
            className={`p-3 rounded-md ${activeContent === "Budget Status" ? "bg-blue-200 text-blue-600" : "bg-gray-200 text-gray-900"}`}
          >
            Budget Status
          </button>
        </div>

        {/* Search Input */}
        {activeContent === "Employee Suggestions" && (
          <div className="mb-6 space-y-4">
            {renderCategoryFilter()}
            {viewMode === 'all' && (
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="p-3 border border-gray-300 rounded-md"
                />
                <span className="text-sm">
                  Showing suggestions for: {new Date(selectedDate).toLocaleDateString()}
                </span>
              </div>
            )}
            <input
              type="text"
              placeholder="Search Suggestions..."
              className="w-full p-3 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {renderViewModeButtons()}
            {viewMode !== 'all' && (
              <span className={`font-medium ${
                viewMode === 'approved' ? 'text-green-500' : 'text-red-500'
              }`}>
                Showing {viewMode === 'approved' ? 'Approved' : 'Rejected'} Suggestions Only
              </span>
            )}
          </div>
        )}

        {/* Display content based on active selection */}
        {activeContent === "Employee Suggestions" && (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : (
              <>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    {renderTableHeaders()}
                  </thead>
                  <tbody>
                    {currentSuggestions.length > 0 ? (
                      currentSuggestions.map((suggestion, index) => renderTableRow(suggestion, index))
                    ) : (
                      <tr>
                        <td colSpan={viewMode !== 'all' ? "6" : "7"} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                          No suggestions available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md ml-2"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Budget Request Form and Budget Status */}
        {activeContent === "Budget Requests" && <AdminBudgetRequest />}
        {activeContent === "Budget Status" && <AdminBudgetStatus />}
      </main>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Provide Feedback</h3>
            <textarea
              className="w-full h-32 p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedback("");
                  setSelectedSuggestion(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                disabled={!feedback.trim()}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployeeSuggestion;
