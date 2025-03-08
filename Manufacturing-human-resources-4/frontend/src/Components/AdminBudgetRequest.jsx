import React, { useState, useCallback } from "react";
import axios from "axios";

const BUDGETREQUEST = process.env.NODE_ENV === "development"
? "http://localhost:7688/api/budget-requests/request-budget"
: "https://backend-hr4.jjm-manufacturing.com/api/budget-requests/request-budget";

const AdminBudgetRequest = () => {
  const [budgetRequest, setBudgetRequest] = useState({
    department: "HR4",
    status: "Pending",
    totalBudget: "",
    category: "",
    reason: "",
    documents: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setBudgetRequest((prevBudgetRequest) => ({
      ...prevBudgetRequest,
      [name]: value,
    }));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  }, []);

  const uploadFileToCloudinary = async (file) => {
    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF and Word documents are allowed');
    }

    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Hr4_BudgetRequest'); // Make sure this matches your Cloudinary upload preset
    formData.append('cloud_name', 'dhawghlsr');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dhawghlsr/raw/upload', // Changed to raw upload for documents
        formData
      );

      if (!response.data || !response.data.secure_url) {
        throw new Error('Upload failed - no URL received');
      }

      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'File upload failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setLoading(true);

    try {
      let documentUrl = '';
      if (selectedFile) {
        try {
          documentUrl = await uploadFileToCloudinary(selectedFile);
        } catch (uploadError) {
          setError(uploadError.message);
          setIsSubmitting(false);
          setLoading(false);
          return;
        }
      }

      const payload = {
        totalBudget: budgetRequest.totalBudget,
        category: budgetRequest.category,
        reason: budgetRequest.reason,
        documents: documentUrl,
      };

      const response = await axios.post(
        BUDGETREQUEST,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      // Reset form
      setBudgetRequest({
        ...budgetRequest,
        totalBudget: "",
        category: "",
        reason: "",
        documents: "",
      });
      setSelectedFile(null);
      e.target.reset();
      
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 relative">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg">
          Budget Request Submitted Successfully!
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-6">Submit Budget Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="department" className="text-lg font-semibold">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={budgetRequest.department}
              disabled
              className="p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="totalBudget" className="text-lg font-semibold">
              Total Budget
            </label>
            <input
              type="number"
              id="totalBudget"
              name="totalBudget"
              value={budgetRequest.totalBudget}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="category" className="text-lg font-semibold">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={budgetRequest.category}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md"
            >
              <option value="">Select a Category</option>
              <option value="Operational Expenses">Operational Expenses</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="reason" className="text-lg font-semibold">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={budgetRequest.reason}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="documents" className="text-lg font-semibold">
              Upload Documents
            </label>
            <input
              type="file"
              id="documents"
              name="documents"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBudgetRequest;
