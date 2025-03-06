import React, { useState } from "react";
import axios from "axios";

const EMCOMPLAINT = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/EmComplaint"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/EmComplaint";

const EmComplaint = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstname || "");
  const [lastName, setLastName] = useState(user?.lastname || "");
  const [complaint, setComplaint] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [notification, setNotification] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = '';
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

    try {
      let attachmentUrl = null;
      if (attachment) {
        attachmentUrl = await uploadFileToCloudinary(attachment);
      }

      const formData = {
        FirstName: firstName,
        LastName: lastName,
        ComplaintDescription: complaint,
        File: attachmentUrl
      };

      const response = await axios.post(
        `${EMCOMPLAINT}/api/auth/EmComplaint`,
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
              <input
                type="text"
                placeholder="Enter your first name"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
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
              <label className="block text-lg font-medium text-gray-700 mb-2">Attachment</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
                accept="image/*,.pdf,.doc,.docx,.txt" // Add accepted file types
              />
              <small className="text-gray-500">Max file size: 10MB. Supported formats: Images, PDF, DOC, DOCX, TXT</small>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
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
