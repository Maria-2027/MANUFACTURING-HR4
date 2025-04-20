import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import layout from "./Assets/layout.jpg";

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

const EmComplaint = () => {
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
  const [complaintType, setComplaintType] = useState("");
  const [complaintAgainst, setComplaintAgainst] = useState("");
  const [complaintAgainstPosition, setComplaintAgainstPosition] = useState("");
  const [complaintAgainstDepartment, setComplaintAgainstDepartment] = useState("");
  const [notification, setNotification] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

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
  }, []);

  const generateComplaintPDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    try {
      const img = new Image();
      img.src = layout;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const logoData = canvas.toDataURL('image/jpeg');

      pdf.addImage(logoData, 'JPEG', 85, 15, 40, 40);

      pdf.setFontSize(20);
      pdf.setTextColor(0, 48, 87);
      pdf.text('JJM Manufacturing', 105, 65, { align: 'center' });
      
      pdf.setFontSize(16);
      pdf.text('EMPLOYEE COMPLAINT FORM', 105, 75, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setDrawColor(0, 48, 87);
      pdf.setLineWidth(0.5);
      pdf.line(20, 90, 190, 90);

      let yPos = 100;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 48, 87);
      pdf.text('COMPLAINANT INFORMATION', 20, yPos);
      
      yPos += 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(`Name: ${firstName} ${lastName}`, 20, yPos);
      pdf.text(`Date Filed: ${new Date().toLocaleDateString()}`, 120, yPos);

      yPos += 15;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 48, 87);
      pdf.text('PERSON BEING COMPLAINED ABOUT', 20, yPos);
      
      yPos += 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(`Name: ${complaintAgainst}`, 20, yPos);
      pdf.text(`Position: ${complaintAgainstPosition}`, 120, yPos);
      yPos += 8;
      pdf.text(`Department: ${complaintAgainstDepartment}`, 20, yPos);

      yPos += 15;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 48, 87);
      pdf.text('COMPLAINT DETAILS', 20, yPos);
      
      yPos += 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(`Type of Complaint: ${complaintType}`, 20, yPos);

      yPos += 10;
      pdf.text('Description:', 20, yPos);
      yPos += 5;
      const complaintLines = pdf.splitTextToSize(complaint, 150);
      complaintLines.forEach(line => {
        pdf.text(line, 20, yPos);
        yPos += 5;
      });

      yPos = Math.max(yPos + 30, 220);
      pdf.line(20, yPos, 80, yPos);
      pdf.line(120, yPos, 180, yPos);
      pdf.text("Complainant's Signature", 20, yPos + 5);
      pdf.text("Received by (HR)", 120, yPos + 5);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos + 10);
      pdf.text(`Date: _________________`, 120, yPos + 10);

      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('CONFIDENTIAL - For Internal Use Only', 105, 270, { align: 'center' });

      return pdf;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  };

  const uploadFileToCloudinary = async (pdfFile) => {
    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("upload_preset", "Hr4_BudgetRequest");
    formData.append("resource_type", "raw");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dhawghlsr/raw/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateComplaintPDF().then(pdf => {
      const pdfData = pdf.output('datauristring');
      setPdfPreview(pdfData);
      setShowPdfPreview(true);
    });
  };

  const handleConfirmSubmit = () => {
    setShowPdfPreview(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);
    setIsError(false);
    setShowSuccess(false);
    setIsLoading(true);

    try {
      const pdf = await generateComplaintPDF();
      const pdfFile = new File(
        [pdf.output('blob')], 
        `complaint_${firstName}_${lastName}.pdf`, 
        { type: 'application/pdf' }
      );
      
      // Upload PDF to Cloudinary
      const cloudinaryUrl = await uploadFileToCloudinary(pdfFile);
      
      // Create form data for backend
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('ComplaintType', complaintType);
      formData.append('ComplaintDescription', complaint);
      formData.append('complaintAgainst', complaintAgainst);
      formData.append('complaintAgainstPosition', complaintAgainstPosition);
      formData.append('complaintAgainstDepartment', complaintAgainstDepartment);
      formData.append('date', new Date().toISOString());
      formData.append('File', cloudinaryUrl);

      // Send to backend
      const response = await axios.post(EMCOMPLAINT, formData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
        }
      });

      if (response.data) {
        // Trigger PDF download
        pdf.save(`complaint_${firstName}_${lastName}.pdf`);

        setShowSuccess(true);
        // Clear form
        setComplaint("");
        setComplaintType("");
        setComplaintAgainst("");
        setComplaintAgainstPosition("");
        setComplaintAgainstDepartment("");
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setIsError(true);
      setNotification(
        error.response?.data?.message || 
        "Failed to submit complaint. Please check your network connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPdfPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white p-6 rounded-xl shadow-xl w-[90vw] h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Preview Complaint Form</h3>
                <div className="space-x-2">
                  <button
                    onClick={handleConfirmSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowPdfPreview(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full bg-gray-100 rounded">
                <iframe
                  src={pdfPreview}
                  className="w-full h-full border-0 rounded"
                  title="Complaint Form Preview"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <label className="block text-base font-medium text-gray-700 mb-1">Person Being Complained About</label>
                <input
                  type="text"
                  value={complaintAgainst}
                  onChange={(e) => setComplaintAgainst(e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  value={complaintAgainstPosition}
                  onChange={(e) => setComplaintAgainstPosition(e.target.value)}
                  placeholder="Position"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  value={complaintAgainstDepartment}
                  onChange={(e) => setComplaintAgainstDepartment(e.target.value)}
                  placeholder="Department"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg"
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
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
