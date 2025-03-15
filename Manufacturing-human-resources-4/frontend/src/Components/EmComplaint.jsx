import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const EMCOMPLAINT = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/EmComplaint"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/EmComplaint";

const PROFILE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:7688/api/auth/testLog'
  : 'https://backend-hr4.jjm-manufacturing.com/api/auth/testLog';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development'
    ? 'http://localhost:7688'
    : 'https://backend-hr4.jjm-manufacturing.com',
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  }
});

const EmComplaint = () => {  // Removed user prop
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData).firstName : "";
  });
  const [lastName, setLastName] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData).lastName : "";
  });
  const [complaint, setComplaint] = useState("");
  const [complaintType, setComplaintType] = useState(""); // Add this line
  const [attachment, setAttachment] = useState(null);
  const [notification, setNotification] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/auth/testLog');
      if (response.data) {
        const userData = response.data.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
      }
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
    formData.append("resource_type", "raw"); // 🔥 Dinagdag ito para matanggap kahit anong file
  
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhawghlsr/raw/upload",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);
    setIsError(false);
    setShowSuccess(false);
    setIsLoading(true);

    if (!attachment) {
      setIsError(true);
      setNotification("Please attach a PDF file before submitting.");
      setIsLoading(false);
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
        firstName: firstName,
        lastName: lastName,
        ComplaintType: complaintType,
        ComplaintDescription: complaint,
        File: attachmentUrl,
        date: new Date().toISOString()
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
        setShowSuccess(true);
        setNotification("");
        setIsError(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-4">Confirm Submission</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to submit this complaint?</p>
              <div className="flex space-x-4 justify-end">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmedSubmit}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white p-8 rounded-xl shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <svg
                    className="mx-auto h-16 w-16 text-green-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </svg>
                </motion.div>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 mb-4"
                >
                  Complaint Submitted Successfully!
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600"
                >
                  Thank you for your feedback. We will review it shortly.
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="p-4 max-w-4xl mx-auto mt-20 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg transform hover:scale-[1.01] transition-all duration-300"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-6"
        >
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 pr-6"
          >
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-6 hover:scale-105 transition-transform"
            >
              Employee Complaint
            </motion.h1>

            {/* Error Notification */}
            <AnimatePresence>
              {isError && notification && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 mb-6 text-center text-white rounded-lg shadow-xl bg-red-600"
                >
                  {notification}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Form fields with staggered animations */}
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <label className="block text-base font-medium text-gray-700 mb-1">First Name</label>
                <div className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-inner">
                  {firstName || 'Loading...'}
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <label className="block text-base font-medium text-gray-700 mb-1">Last Name</label>
                <div className="w-full p-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 shadow-inner">
                  {lastName || 'Loading...'}
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <label className="block text-base font-medium text-gray-700 mb-1">Complaint Type</label>
                <select
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm hover:border-blue-400 transition-colors"
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  required
                >
                  <option value="">Select a complaint type</option>
                  <option value="Salary issue">Salary issue</option>
                  <option value="Benefits issue">Benefits issue</option>
                  <option value="Workplace Conflict">Workplace Conflict</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Unfair treatment">Unfair treatment</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <label className="block text-base font-medium text-gray-700 mb-1">Complaint Description</label>
                <textarea
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm hover:border-blue-400 transition-colors"
                  rows={3}
                  placeholder="Describe your complaint..."
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  required
                ></textarea>
              </motion.div>

              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="transform transition-all duration-300 hover:scale-[1.02]"
              >
                <label className="block text-base font-medium text-gray-700 mb-1">
                  Attachment (Required) <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 shadow-sm hover:border-blue-400 transition-colors"
                  accept=".pdf"
                  required
                />
                <small className="text-sm text-gray-500">PDF only. Max: 10MB</small>
              </motion.div>

              <motion.button
                type="submit"
                disabled={!attachment || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="p-4 w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl
                  shadow-lg transition-all duration-300 hover:shadow-2xl
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  relative overflow-hidden group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <span>Submit Complaint</span>
                )}
              </motion.button>
            </motion.form>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-1/2 pl-6 flex items-center"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl shadow-inner"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                We highly value your feedback. Please describe the issue you're facing. 
                Attach relevant files, and we will address your concerns promptly.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default EmComplaint;