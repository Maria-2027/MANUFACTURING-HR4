import React, { useState, useEffect } from "react";
import { FaSearch, FaExclamationCircle, FaRegCommentDots, FaEnvelope, FaChartBar, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import layout from "./Assets/layout.jpg"; // Logo image
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Add Link import
import AdminHr3Compensate from "./AdminHr3Compensate";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ADMINGRIEVANCE = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/EmComplaint"
    : "https://backend-hr4.jjm-manufacturing.com/Emcomplaint";

const  TAKEACTION =  process.env.NODE_ENV === "development"
    ? "http://localhost:7688/api/grievance/submit-action"
    : "https://backend-hr4.jjm-manufacturing.com/api/grievance/submit-action";

const AdminGrievance = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Employee Grievances");
  const [complaints, setComplaints] = useState([]); // State to store grievances
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [itemsPerPage] = useState(8); // Number of items per page (set to 8 columns)
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" }); // Sorting configuration
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [lastClipboardCheck, setLastClipboardCheck] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleCompensationClick = () => {
    navigate('/admin-compensate'); // Update this line to navigate to AdminHr3Compensate
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'in-review', label: 'In Review', color: 'blue' },
    { value: 'resolved', label: 'Resolved', color: 'green' },
    { value: 'escalated', label: 'Escalated', color: 'red' }
  ];

  const departmentOptions = [
    'HR Manager',
    'Department Supervisor',
    'Legal Team',
    'Employee Relations',
    'Senior Management'
  ];

  useEffect(() => {
    axios
      .get(ADMINGRIEVANCE)
      .then((response) => {
        console.log('API Response:', response.data); // For debugging
        setComplaints(response.data);
      })
      .catch((err) => console.log(err));
  }, [currentPage, itemsPerPage, sortConfig]);

  useEffect(() => {
    let lastActions = {
      clipboard: 0,
      printscreen: 0,
      rightclick: 0,
      keyboard: 0
    };
    const actionCooldown = 1000; // 1 second cooldown

    const canShowNotification = (actionType) => {
      const now = Date.now();
      if (now - lastActions[actionType] >= actionCooldown) {
        lastActions[actionType] = now;
        return true;
      }
      return false;
    };

    const showNotification = (message, actionType = 'keyboard') => {
      if (canShowNotification(actionType)) {
        toast.error(message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
          style: {
            backgroundColor: '#ff4d4d',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '12px',
          }
        });
      }
    };

    const monitorClipboard = async () => {
      try {
        const newClip = await navigator.clipboard.readText();
        if (newClip !== lastClipboardCheck && newClip.trim() !== '') {
          showNotification('❌ Copying is not allowed', 'clipboard');
          await navigator.clipboard.writeText('');
          setLastClipboardCheck('');
        }
      } catch (err) {
        // Silent fail for clipboard API errors
      }
    };

    const handleKeyDown = (event) => {
      // Updated PrintScreen detection
      if (event.code === 'PrintScreen' || event.key === 'PrintScreen' || event.keyCode === 44) {
        event.preventDefault();
        showNotification('🚫 Screenshots are not allowed', 'printscreen');
        return false;
      }

      // Copy/paste detection
      if ((event.ctrlKey || event.metaKey) && ['c', 'v', 'x'].includes(event.key.toLowerCase())) {
        event.preventDefault();
        showNotification('⚠️ Copy/Paste is not allowed', 'keyboard');
        return false;
      }

      // Print detection
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        showNotification('🛑 Printing is not allowed', 'keyboard');
        return false;
      }
    };

    // Add both keyup and keydown listeners for PrintScreen
    const handleKeyUp = (event) => {
      if (event.code === 'PrintScreen' || event.key === 'PrintScreen' || event.keyCode === 44) {
        event.preventDefault();
        showNotification('🚫 Screenshots are not allowed', 'printscreen');
        return false;
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
      showNotification('🔒 Right-click is disabled', 'rightclick');
      return false;
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    const clipboardInterval = setInterval(monitorClipboard, 1000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      clearInterval(clipboardInterval);
    };
  }, [lastClipboardCheck]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const themeClasses = darkMode
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-r from-gray-50 to-gray-200 text-gray-900";
  const sidebarClasses = darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonHoverClasses = darkMode
    ? "hover:bg-gray-700 text-white"
    : "hover:bg-gray-100 text-gray-800";

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const themeToggleClasses = darkMode ? "text-yellow-500" : "text-gray-800";

  // Search filtering
  const filteredComplaints = complaints.filter((complaint) => {
    const firstName = complaint.employee?.firstName || complaint.firstName || "";
    const lastName = complaint.employee?.lastName || complaint.lastName || "";
    const complaintType = complaint.ComplaintType || ""; // Fixed: Changed from complaintType to ComplaintType
    const complaintDescription = complaint.ComplaintDescription || "";
    
    return (
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaintType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaintDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting logic
  const sortedComplaints = filteredComplaints.sort((a, b) => {
    if (sortConfig.key === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortConfig.key === "firstName" || sortConfig.key === "lastName" || sortConfig.key === "ComplaintType") {
      const valueA = a[sortConfig.key] || '';
      const valueB = b[sortConfig.key] || '';
      return sortConfig.direction === "asc" 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);

  const handleLogoClick = (e) => {
    e.preventDefault();
    console.log("Logo clicked");
    navigate("/admin-dashboard"); // Use navigate to go to admin-dashboard
  };

  const FileDisplay = ({ fileUrl }) => {
    if (!fileUrl) return <span className="text-gray-500">No File</span>;
  
    const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/i);
    const isPDF = fileUrl.toLowerCase().includes('.pdf');
  
    if (isImage) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
        >
          <img src={fileUrl} alt="Attachment" className="w-10 h-10 object-cover rounded" />
          View Image
        </a>
      );
    }
  
    if (isPDF) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline flex items-center gap-2"
        >
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a2 2 0 00-2 2v8l-3.146-3.146a.5.5 0 01.708-.708L8 11.793l3.438-3.437a.5.5 0 01.708.708L9 12.207V4a1 1 0 012 0v8.793l2.146-2.147a.5.5 0 01.708.708L10.707 14.5a1 1 0 01-1.414 0L6.146 11.354a.5.5 0 01.708-.708L9 13.293V4a2 2 0 00-2-2z"/>
          </svg>
          View PDF
        </a>
      );
    }
  
    return (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        View File
      </a>
    );
  };

  const BlurredDescription = ({ description }) => {
    const [isBlurred, setIsBlurred] = useState(true);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');
    const [attempts, setAttempts] = useState(7); // Set initial attempts to 7
    const correctPassword = 'jjm123';
    const navigate = useNavigate();
    
    const handleClick = () => {
      if (!isBlurred) {
        setIsBlurred(true);
        return;
      }
      if (attempts <= 0) {
        toast.error('No attempts remaining. You will be logged out.');
        setTimeout(() => {
          localStorage.clear();
          navigate('/');
        }, 2000);
        return;
      }
      setShowPasswordModal(true);
    };

    const handlePasswordSubmit = (e) => {
      e.preventDefault();
      if (password === correctPassword) {
        setIsBlurred(false);
        setShowPasswordModal(false);
        setPassword('');
        // Reset attempts on successful password
        setAttempts(7);
      } else {
        const remainingAttempts = attempts - 1;
        setAttempts(remainingAttempts);
        
        if (remainingAttempts <= 0) {
          toast.error('Maximum attempts reached. You will be logged out.');
          setTimeout(() => {
            localStorage.clear();
            navigate('/');
          }, 2000);
        } else {
          toast.error(`Incorrect password. ${remainingAttempts} attempts remaining`);
        }
        setPassword('');
      }
    };

    return (
      <>
        <div 
          className={`cursor-pointer transition-all duration-300 ${
            isBlurred ? 'blur-sm select-none' : 'blur-none select-text'
          } hover:bg-gray-100 p-2 rounded`}
          onClick={handleClick}
          title={isBlurred ? "Click to reveal" : "Click to blur"}
        >
          {description || 'N/A'}
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-bold mb-4">Enter Password to View</h3>
              <div className="mb-3 text-sm text-gray-600">
                Remaining attempts: <span className={`font-bold ${attempts <= 2 ? 'text-red-500' : 'text-blue-500'}`}>{attempts}</span>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-2 border rounded mb-4"
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword('');
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={attempts <= 0}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  const complaintSeverity = {
    'Harassment': 3,
    'Unfair Treatment': 2,
    'Workplace Conflict': 2,
    'Salary Issue': 1,
    'Benefits Issue': 1
  };

  const groupComplaintsBySeverity = (complaints) => {
    const groups = {
      high: [],
      medium: [],
      low: []
    };

    complaints.forEach(complaint => {
      const severity = complaintSeverity[complaint.ComplaintType] || 0;
      if (severity === 3) groups.high.push(complaint);
      else if (severity === 2) groups.medium.push(complaint);
      else if (severity === 1) groups.low.push(complaint);
    });

    return groups;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await axios.patch(`${ADMINGRIEVANCE}/${complaintId}/status`, { status: newStatus });
      // Update local state
      setComplaints(complaints.map(c => 
        c._id === complaintId ? { ...c, status: newStatus } : c
      ));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAssign = async (complaintId, assignedTo) => {
    try {
      await axios.patch(`${ADMINGRIEVANCE}/${complaintId}/assign`, { assignedTo });
      setComplaints(complaints.map(c => 
        c._id === complaintId ? { ...c, assignedTo } : c
      ));
      toast.success('Complaint assigned successfully');
    } catch (error) {
      toast.error('Failed to assign complaint');
    }
  };

  const ActionModal = ({ complaint, onClose }) => {
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState(complaint.status || 'pending');
    const [assignedTo, setAssignedTo] = useState(complaint.assignedTo || '');
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [actionType, setActionType] = useState('');
    // Set initial priority based on complaint type
    const [priority] = useState(() => {
      const severity = complaintSeverity[complaint.ComplaintType] || 0;
      if (severity === 3) return 'high';
      if (severity === 2) return 'medium';
      if (severity === 1) return 'low';
      return 'medium'; // default
    });
    const [dueDate, setDueDate] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [resolution, setResolution] = useState('');
    const [notifyEmployee, setNotifyEmployee] = useState(false);

    const generateActionPDF = async () => {
      // Create PDF in portrait, letter size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });
      
      try {
        // Create new Image object for logo
        const img = new Image();
        img.src = layout;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Convert logo to base64
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const logoData = canvas.toDataURL('image/jpeg');

        // Add logo at top center - moved up
        pdf.addImage(logoData, 'JPEG', 85, 10, 40, 40);

        // Add main title - moved up
        pdf.setFontSize(20);
        pdf.setTextColor(0, 48, 87); // Dark blue
        pdf.text('JJM Manufacturing', 105, 60, { align: 'center' });
        
        // Add document title - moved up
        pdf.setFontSize(16);
        pdf.text('GRIEVANCE ACTION REPORT', 105, 70, { align: 'center' });
        
        // Add reference number and date - moved up
        pdf.setFontSize(10);
        pdf.text(`Ref No: GR-${complaint._id?.slice(-6) || 'XXXXXX'}`, 20, 80);
        pdf.text(`Date: ${new Date().toLocaleDateString()}`, 170, 80, { align: 'right' });

        // Add horizontal line - moved up
        pdf.setDrawColor(0, 48, 87);
        pdf.setLineWidth(0.5);
        pdf.line(20, 85, 190, 85);

        // Employee Information Section
        pdf.setFontSize(12);
        pdf.setTextColor(0, 48, 87);
        pdf.text('EMPLOYEE INFORMATION', 20, 100);
        
        let yPos = 110;
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);

        // Employee and complaint details on one line
        pdf.setFont('helvetica', 'bold');
        pdf.text('Employee Name:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${complaint.firstName} ${complaint.lastName}`, 80, yPos);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Complaint Type:', 120, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(complaint.ComplaintType, 160, yPos);
        
        // Person Being Complained About section
        yPos += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 48, 87);
        pdf.text('PERSON BEING COMPLAINED ABOUT', 20, yPos);
        pdf.setTextColor(0, 0, 0);
        
        yPos += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Full Name:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(complaint.complaintAgainst || 'N/A', 80, yPos);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Position:', 120, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(complaint.complaintAgainstPosition || 'N/A', 160, yPos);
        
        yPos += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Department:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(complaint.complaintAgainstDepartment || 'N/A', 80, yPos);

        // Complaint Description
        yPos += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 48, 87);
        pdf.text('COMPLAINT DESCRIPTION:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        yPos += 8;
        pdf.text(complaint.ComplaintDescription || 'N/A', 20, yPos);

        // Action Details Section
        yPos += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 48, 87);
        pdf.text('ACTION DETAILS', 20, yPos);
        pdf.setTextColor(0, 0, 0);
        yPos += 8;

        // Action details in simplified format
        pdf.setFont('helvetica', 'bold');
        pdf.text('Status:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(status, 80, yPos);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Priority Level:', 120, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(priority, 160, yPos);

        yPos += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Action Type:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(actionType || 'N/A', 80, yPos);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Assigned To:', 120, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(assignedTo || 'N/A', 160, yPos);

        yPos += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Due Date:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(dueDate || 'N/A', 80, yPos);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Follow-up Date:', 120, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(followUpDate || 'N/A', 160, yPos);

        // Resolution Details
        yPos += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 48, 87);
        pdf.text('RESOLUTION DETAILS:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        yPos += 8;
        pdf.text(resolution || 'N/A', 20, yPos);

        // Comments
        yPos += 15;
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 48, 87);
        pdf.text('COMMENTS:', 20, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        yPos += 8;
        pdf.text(comment || 'N/A', 20, yPos);

        // Signatures
        yPos = Math.min(yPos + 30, 240);
        pdf.line(20, yPos, 80, yPos);
        pdf.line(120, yPos, 180, yPos);
        pdf.setFontSize(10);
        pdf.text('HR Manager Signature', 20, yPos + 5);
        pdf.text('Department Head Signature', 120, yPos + 5);

        // Footer - Ensure it stays at bottom with proper margins
        pdf.setDrawColor(0, 48, 87);
        pdf.setLineWidth(0.5);
        pdf.line(20, 260, 190, 260);
        pdf.setFontSize(8);
        pdf.setTextColor(0, 48, 87);
        pdf.text('CONFIDENTIAL - Internal Use Only', 105, 265, { align: 'center' });
        pdf.text(`Generated on: ${new Date().toLocaleString()} | Document ID: GR-${complaint._id?.slice(-6) || 'XXXXXX'}`, 105, 270, { align: 'center' });

      } catch (error) {
        console.error('Error generating PDF:', error);
        // Fallback to basic PDF if logo fails
        pdf.setFontSize(20);
        pdf.setTextColor(0, 48, 87);
        pdf.text('JJM Manufacturing', 105, 20, { align: 'center' });
      }
      
      return pdf;
    };

    const handlePreviewPDF = async () => {
      try {
        const pdf = await generateActionPDF();
        const pdfData = pdf.output('datauristring');
        setPdfUrl(pdfData);
        setShowPreview(true);
      } catch (error) {
        console.error('Preview error:', error);
        toast.error('Failed to generate preview');
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!actionType) {
        toast.error('Please select an Action Type');
        return;
      }
    
      try {
        const pdf = await generateActionPDF();
        const pdfBlob = pdf.output('blob');
        
        // Convert PDF to base64
        const base64PDF = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(pdfBlob);
        });

        const actionData = {
          complaintId: complaint._id,
          actionType: actionType,
          status: status,
          assignedTo: assignedTo,
          priority: priority,
          dueDate: dueDate || null,
          followUpDate: followUpDate || null,
          resolution: resolution,
          comment: comment,
          notifyEmployee: notifyEmployee,
          reportFile: base64PDF // Send the PDF as base64
        };

        const response = await axios.post(TAKEACTION, actionData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          toast.success('Action taken and report generated successfully');
          onClose();
          window.location.reload();
        }
      } catch (error) {
        console.error('Submit error:', error.response?.data || error);
        toast.error(error.response?.data?.message || 'Failed to submit action');
      }
    };

    // Add this function to handle PDF viewing
    const ViewActionReport = ({ reportUrl }) => {
      if (!reportUrl) return null;
    
      // If the reportUrl is base64
      if (reportUrl.startsWith('data:application/pdf;base64,')) {
        return (
          <embed
            src={reportUrl}
            type="application/pdf"
            width="100%"
            height="600px"
          />
        );
      }
    
      // If the reportUrl is a path from the server
      const fullUrl = process.env.NODE_ENV === "development"
        ? `http://localhost:7688/${reportUrl}`
        : `https://backend-hr4.jjm-manufacturing.com/${reportUrl}`;
    
      return (
        <embed
          src={fullUrl}
          type="application/pdf"
          width="100%"
          height="600px"
        />
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg max-w-4xl w-full h-[90vh] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Take Action on Grievance</h2>
          {!showPreview ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-semibold">Status</label>
                    <select 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-semibold">Action Type</label>
                    <select 
                      value={actionType} 
                      onChange={(e) => setActionType(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Action Type</option>
                      {[
                        'Investigation Required',
                        'Immediate Resolution',
                        'Mediation Required',
                        'Policy Review',
                        'Training/Education Required',
                        'Disciplinary Action',
                        'No Action Required'
                      ].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Replace the Priority Level select with a display-only field */}
                  <div>
                    <label className="block mb-1 font-semibold">Priority Level</label>
                    <div className={`w-full p-2 border rounded ${
                      priority === 'high' ? 'bg-red-50 text-red-700' :
                      priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Assign To</label>
                    <select 
                      value={assignedTo} 
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Assignee</option>
                      {departmentOptions.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-semibold">Due Date (Optional)</label>
                    <input 
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-2 border rounded"
                      min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Follow-up Date (Optional)</label>
                    <input 
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full p-2 border rounded"
                      min={dueDate || new Date().toISOString().split('T')[0]} // Set minimum date to due date or today
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold">Resolution Details</label>
                    <textarea 
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows="3"
                      placeholder="Enter resolution details..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      id="notifyEmployee"
                      checked={notifyEmployee}
                      onChange={(e) => setNotifyEmployee(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="notifyEmployee" className="font-semibold">
                      Notify Employee of Action
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Action Comments</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="4"
                  placeholder="Enter detailed action comments here..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={handlePreviewPDF} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                  Preview Report
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Submit & Generate Report
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Report</h3>
                <div className="space-x-2">
                  <a 
                    href={pdfUrl} 
                    download={`grievance-action-${complaint._id}.pdf`}
                    className="px-4 py-2 bg-green-500 text-white rounded inline-block"
                  >
                    Download PDF
                  </a>
                  <button 
                    onClick={() => {
                      setShowPreview(false);
                      URL.revokeObjectURL(pdfUrl); // Clean up the URL when closing preview
                    }} 
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Back to Form
                  </button>
                  <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
                    Close
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full h-[calc(90vh-120px)]">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border border-gray-300 rounded"
                  style={{ minHeight: '600px' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TableRow = ({ complaint, priorityColor }) => {
    const [showPdfModal, setShowPdfModal] = useState(false);
  
    const PDFViewerModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Grievance Report</h3>
            <button 
              onClick={() => setShowPdfModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="flex-1 p-4">
            <object
              data={process.env.NODE_ENV === "development"
                ? `http://localhost:7688/${complaint.reportFile}`
                : `https://backend-hr4.jjm-manufacturing.com/${complaint.reportFile}`}
              type="application/pdf"
              width="100%"
              height="100%"
              className="border border-gray-300 rounded"
            >
              <embed
                src={process.env.NODE_ENV === "development"
                  ? `http://localhost:7688/${complaint.reportFile}`
                  : `https://backend-hr4.jjm-manufacturing.com/${complaint.reportFile}`}
                type="application/pdf"
                width="100%"
                height="100%"
              />
              <p>Your browser doesn't support embedded PDFs. 
                <a href={process.env.NODE_ENV === "development"
                  ? `http://localhost:7688/${complaint.reportFile}`
                  : `https://backend-hr4.jjm-manufacturing.com/${complaint.reportFile}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Click here to view the PDF.
                </a>
              </p>
            </object>
          </div>
        </div>
      </div>
    );
  
    return (
      <>
        <tr className={`border-b hover:bg-${priorityColor}-50`}>
          <td className="py-2 px-4">{complaint.firstName}</td>
          <td className="py-2 px-4">{complaint.lastName}</td>
          <td className="py-2 px-4">
            <BlurredDescription description={complaint.ComplaintDescription} />
          </td>
          <td className="py-2 px-4">{complaint.ComplaintType}</td>
          <td className="py-2 px-4">{new Date(complaint.date).toLocaleDateString()}</td>
          <td className="py-2 px-4">
            <FileDisplay fileUrl={complaint.File} />
          </td>
          <td className="py-2 px-4">
            <div className="flex space-x-2">
              <select
                value={complaint.status || 'pending'}
                onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                className={`p-1 rounded text-sm`}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setShowActionModal(true);
                }}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Take Action
              </button>
              {complaint.reportFile && (
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                >
                  View Report
                </button>
              )}
            </div>
          </td>
        </tr>
        {showPdfModal && <PDFViewerModal />}
      </>
    );
  };

  return (
    <div className="flex min-h-screen">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        limit={1}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
      />
      {/* Fixed Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-72 shadow-lg ${sidebarClasses}`}>
        <div className="flex flex-col h-full p-6">
          {/* Logo and Title - Fixed */}
          <div className="flex-shrink-0">
            <div className="flex justify-center mb-6">
              <img src={layout} alt="JJM Logo" className="w-32 h-32 rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-8">JJM Admin Portal</h2>
          </div>

          {/* Navigation - Scrollable if needed */}
          <nav className="flex-grow overflow-y-auto">
            <ul className="space-y-4">
              {[{ title: "Employee Grievances", icon: <FaExclamationCircle className="text-lg" />, link: "/admin-grievance" },
                { title: "Employee Suggestions", icon: <FaRegCommentDots className="text-lg" />, link: "/admin-employee-suggestion" },
                { title: "Communication Hub", icon: <FaEnvelope className="text-lg" />, link: "/admin-communication" },
                { title: "Workforce Analytics", icon: <FaChartBar className="text-lg" />, link: "/admin-workflow" }]
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

          {/* Logout Button */}
          <div className="flex-shrink-0 mt-auto pt-4">
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center space-x-4 text-lg font-semibold p-3 rounded-md cursor-pointer transition duration-200 ${buttonHoverClasses} w-full`}
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content - Scrollable with margin for sidebar */}
      <main className="ml-72 flex-1 min-h-screen p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* High Priority Complaints */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-4">High Priority</h3>
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-red-100">
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">First Name</th>
                  <th className="py-2 px-4 text-left">Last Name</th>
                  <th className="py-2 px-4 text-left">Complaint Description</th>
                  <th className="py-2 px-4 text-left">Complaint Type</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">File</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupComplaintsBySeverity(sortedComplaints).high.map((complaint, index) => (
                  <TableRow key={index} complaint={complaint} priorityColor="red" />
                ))}
              </tbody>
            </table>
          </div>

          {/* Medium Priority Complaints */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Medium Priority</h3>
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-yellow-100">
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">First Name</th>
                  <th className="py-2 px-4 text-left">Last Name</th>
                  <th className="py-2 px-4 text-left">Complaint Description</th>
                  <th className="py-2 px-4 text-left">Complaint Type</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">File</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupComplaintsBySeverity(sortedComplaints).medium.map((complaint, index) => (
                  <TableRow key={index} complaint={complaint} priorityColor="yellow" />
                ))}
              </tbody>
            </table>
          </div>

          {/* Low Priority Complaints */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Low Priority</h3>
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-green-100">
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">First Name</th>
                  <th className="py-2 px-4 text-left">Last Name</th>
                  <th className="py-2 px-4 text-left">Complaint Description</th>
                  <th className="py-2 px-4 text-left">Complaint Type</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">File</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupComplaintsBySeverity(sortedComplaints).low.map((complaint, index) => (
                  <TableRow key={index} complaint={complaint} priorityColor="green" />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Animated pagination controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex justify-between"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Previous
          </motion.button>
          <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Next
          </motion.button>
        </motion.div>
      </main>

      {/* Animated dark mode toggle */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute top-5 right-5"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="bg-gray-200 p-2 rounded-full shadow-lg transition duration-200 hover:bg-gray-300"
        >
          {darkMode ? (
            <FaSun className={`${themeToggleClasses} text-xl`} />
          ) : (
            <FaMoon className={`${themeToggleClasses} text-xl`} />
          )}
        </motion.button>
      </motion.div>
      {showActionModal && selectedComplaint && (
        <ActionModal 
          complaint={selectedComplaint} 
          onClose={() => {
            setShowActionModal(false);
            setSelectedComplaint(null);
          }} 
        />
      )}
    </div>
  );
};

export default AdminGrievance;
