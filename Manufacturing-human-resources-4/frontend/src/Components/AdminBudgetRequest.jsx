import React, { useState, useCallback } from "react";
import axios from "axios";

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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Hr4_BudgetRequest");
    formData.append("resource_type", "raw");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhawghlsr/upload",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log("Cloudinary response:", response.data);
      
      if (!response.data || !response.data.secure_url) {
        throw new Error("Invalid response from Cloudinary");
      }
      
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error.response?.data || error);
      throw new Error(
        error.response?.data?.error?.message || 
        "Failed to upload file. Please try again."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Please select a PDF file to upload");
      return;
    }

    try {
      setLoading(true);
      
      // Upload file first
      const documentUrl = await uploadFileToCloudinary(selectedFile);
      
      const payload = {
        totalBudget: budgetRequest.totalBudget,
        category: budgetRequest.category,
        reason: budgetRequest.reason,
        documents: documentUrl,
      };

      const response = await axios.post(
        "http://localhost:7688/api/budget-requests/request-budget",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Budget Request Submitted Successfully");
      console.log("Response:", response.data);
      
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
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
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
              accept=".pdf"
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );q
};

export default AdminBudgetRequest;
