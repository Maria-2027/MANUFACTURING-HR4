import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EMCOMPLAINT = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/EmComplaint"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/EmComplaint";

const PROFILE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:7688/api/auth/profile'
  : 'https://backend-hr4.jjm-manufacturing.com/api/auth/profile';

const EmComplaint = () => {  // Removed user prop
  const navigate = useNavigate();
  const token = sessionStorage.getItem('accessToken');
  const api = axios.create({
    baseURL: 'http://localhost:7688',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [notification, setNotification] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get(PROFILE);
      if (response.data && response.data.success) {
        setFirstName(response.data.data.firstname);
        setLastName(response.data.data.lastname);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // Empty dependency array means this runs once on mount

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        e.target.value = '';
        setAttachment(null);
        return;
      }
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
        setAttachment(null);
        return;
      }
      setAttachment(file);
    }
  };

  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Hr4_BudgetRequest");
    formData.append("resource_type", "auto"); // 🔥 Dinagdag ito para matanggap kahit anong file
  
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhawghlsr/upload",
        formData
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
    setIsError(false);
    setShowSuccess(false);

    if (!attachment) {
      setIsError(true);
      setNotification("Please attach a PDF file before submitting.");
      setTimeout(() => {
        setNotification("");
        setIsError(false);
      }, 3000);
      return;
    }

    try {
      let attachmentUrl = null;
      if (attachment) {
        attachmentUrl = await uploadFileToCloudinary(attachment);
      }

      const formData = {
        firstName: firstName,  // Changed from FirstName
        lastName: lastName,    // Changed from LastName
        ComplaintDescription: complaint,
        File: attachmentUrl,
        date: new Date().toISOString() // Adding date field
      };

      const response = await axios.post(
        EMCOMPLAINT,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data) {
        // Only show the modal success message
        setShowSuccess(true);
        setNotification(""); // Clear any existing notification
        setIsError(false);
        
        // Reset form
        setComplaint("");
        setAttachment(null);
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        throw new Error("No response data received");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setIsError(true);
      setShowSuccess(false);
      setNotification(
        error.response?.data?.message || 
        error.message || 
        "Failed to submit complaint. Please try again."
      );

      setTimeout(() => {
        setNotification("");
        setIsError(false);
      }, 3000);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-xl">
      {/* Show Success Modal Only when showSuccess is true */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-500 ease-in-out animate-bounce">
            <div className="text-center">
              <svg
                className="mx-auto h-16 w-16 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Complaint Submitted Successfully!
              </h2>
              <p className="text-gray-600">
                Thank you for your feedback. We will review it shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex mb-8 space-x-10">
        <div className="w-1/2 pr-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">Employee Complaint</h1>

          {/* Show Notification Banner Only for Errors */}
          {isError && notification && (
            <div className="p-4 mb-6 text-center text-white rounded-lg shadow-xl bg-red-600">
              {notification}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">First Name</label>
              <div className="w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-700">
                {firstName}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Last Name</label>
              <div className="w-full p-4 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-700">
                {lastName}
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Complaint Description</label>
              <textarea
                className="w-full p-5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
                rows="5"
                placeholder="Describe your complaint..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Attachment (Required) <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
                accept=".pdf"
                required
              />
              <small className="text-gray-500">Required: PDF file only. Max file size: 10MB.</small>
            </div>

            <button
              type="submit"
              disabled={!attachment}
              className={`w-full py-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg ${
                !attachment 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 text-white focus:outline-none focus:ring-4 focus:ring-red-500'
              }`}
            >
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="w-1/2 pl-10 flex items-center justify-center">
          <p className="text-xl font-light text-gray-700 leading-relaxed text-justify">
            We highly value your feedback. Please take a moment to describe the issue you're facing. 
            Attach any relevant files, and we will address your concerns promptly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmComplaint;