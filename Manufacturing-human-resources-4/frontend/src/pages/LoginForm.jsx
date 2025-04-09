import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import layoutImage from "../Components/Assets/layout.jpg"; // Company Branding Image
import axios from 'axios'; // Import axios
import { MetroSpinner } from 'react-spinners-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EMPLOYEELOGIN = process.env.NODE_ENV === "development"
    ? "http://localhost:7688/api/auth/employeelogin"
    : "https://backend-hr4.jjm-manufacturing.com/api/auth/employeelogin";

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [fadeInForm, setFadeInForm] = useState(false);
  const [fadeInText, setFadeInText] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCloseModal = (setter) => {
    setIsClosing(true);
    setTimeout(() => {
      setter(false);
      setIsClosing(false);
    }, 200);
  };

  const ModalWrapper = ({ isOpen, children }) => (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        {children}
      </div>
    </div>
  );

  const TermsModal = () => (
    <ModalWrapper isOpen={showTerms}>
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-4 border-b border-gray-200 flex justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Terms of Service</h2>
          <button 
            onClick={() => handleCloseModal(setShowTerms)} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6 prose max-w-none">
          <p className="text-sm text-gray-600 mb-4">Last Updated: November 20, 2024</p>
          
          <p className="mb-4">Welcome to Human Resources 4, a Manufacturing Management System designed to facilitate Employee Grievances, Employee Suggestions, Communication Hub, and Workforce Analytics. By accessing and using this system, you agree to the following terms and conditions.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">1. Acceptance of Terms</h3>
          <p className="mb-4">By using Human Resources 4, you acknowledge that you have read, understood, and agreed to these Terms of Service. If you do not agree, please refrain from using the system.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">2. User Responsibilities</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Users must provide accurate and up-to-date information.</li>
            <li>Unauthorized access, data tampering, or misuse of system resources is prohibited.</li>
            <li>Users must comply with company policies and applicable laws when submitting grievances, suggestions, or using the communication hub.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">3. Employee Grievances & Suggestions</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>All grievances and suggestions submitted will be reviewed by authorized personnel.</li>
            <li>Users must ensure that all submissions are truthful and relevant to workplace concerns.</li>
            <li>Any false or misleading information may result in disciplinary action.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">4. Communication Hub</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>This platform is intended for professional discussions and official company communication.</li>
            <li>Users are prohibited from posting offensive, inappropriate, or confidential information.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">5. Workforce Analytics</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>The system collects and processes workforce data to improve organizational efficiency.</li>
            <li>Users acknowledge that workforce analytics may involve automated processing of data.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">6. Termination</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Violation of these terms may lead to suspension or permanent restriction from the system.</li>
          </ul>
        </div>
      </div>
    </ModalWrapper>
  );

  const PrivacyModal = () => (
    <ModalWrapper isOpen={showPrivacy}>
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-4 border-b border-gray-200 flex justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Privacy Policy</h2>
          <button 
            onClick={() => handleCloseModal(setShowPrivacy)} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6 prose max-w-none">
          <p className="text-sm text-gray-600 mb-4">Last Updated: November 20, 2024</p>
          
          <p className="mb-4">Human Resources 4 values your privacy. This Privacy Policy outlines how we collect, use, and protect your personal data.</p>
          
          <h3 className="text-xl font-bold mt-6 mb-3">1. Information We Collect</h3>
          <ul className="list-disc pl-5 mb-4">
            <li><strong>Personal Information:</strong> Name, employee ID, email, and contact details.</li>
            <li><strong>Grievances & Suggestions Data:</strong> Issues reported and feedback submitted.</li>
            <li><strong>Communication Data:</strong> Messages and discussions within the communication hub.</li>
            <li><strong>Workforce Analytics Data:</strong> Employee performance, engagement, and behavioral metrics.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">2. How We Use Your Information</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>To process grievances and suggestions efficiently.</li>
            <li>To facilitate internal communication and engagement.</li>
            <li>To analyze workforce trends and improve decision-making.</li>
            <li>To ensure compliance with company policies and legal regulations.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">3. Data Security</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>We implement security measures to protect user data from unauthorized access.</li>
            <li>Only authorized personnel can access sensitive data.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">4. Data Retention</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Employee grievance and communication records are stored securely and retained as per company policy.</li>
            <li>Workforce analytics data may be anonymized for long-term analysis.</li>
          </ul>
          
          <h3 className="text-xl font-bold mt-6 mb-3">5. Your Rights</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>You have the right to access, update, or request deletion of your data (subject to company policies).</li>
            <li>If you have concerns about data privacy, contact [Support Email].</li>
          </ul>
          
          <p className="mt-6 mb-4">By using Human Resources 4, you consent to this Privacy Policy. We may update this policy, and continued use of the system constitutes acceptance of the changes.</p>
          
          <hr className="my-6" />
          
          <p className="text-sm text-gray-600">For inquiries, contact our admin and head department.</p>
        </div>
      </div>
    </ModalWrapper>
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setFadeInForm(true);
    }, 1000);

    setTimeout(() => {
      setFadeInText(true);
    }, 1500);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const requestData = {
        email: formData.email,
        password: formData.password
      };

      const response = await axios.post(EMPLOYEELOGIN, requestData);
      
      if (response.data && response.data.token) {
        if (response.data.user && response.data.user.role !== "Employee") {
          toast.error("Access denied. Only Employees can login here.", {
            position: "top-center",
            autoClose: 3000,
            theme: "colored",
          });
          throw new Error("Access denied. Only Employees can login here.");
        }

        toast.success("Login successful! Please wait...", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });

        sessionStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message === "Access denied. Only Employees can login here."
        ? error.message
        : "Invalid email or password";
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <MetroSpinner 
        size={40} 
        color="#ffffff" 
        loading={true}
        sizeUnit="px"
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center text-gray-700">
          <SyncLoader cssOverride={{}} loading color="#000000" margin={12} size={15} speedMultiplier={0.5} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-opacity-15 px-4">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={1}
      />
      {loading && <LoadingOverlay />}
      {showTerms && <TermsModal />}
      {showPrivacy && <PrivacyModal />}
      <div className="p-6 py-10 w-full max-w-xs h-auto bg-white shadow-lg rounded-lg border">
        <div className="flex justify-center gap-x-2 pb-2">
          <img
            src={layoutImage}
            alt="jjm logo"
            className="w-12 h-12 rounded-full border-2"
          />
          <h2 className="text-2xl font-bold text-center text-gray-800 mt-1">
            LOGIN
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-xs py-2 font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-600 py-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 mt-8 pr-3 flex items-center text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              className="h-3 w-3 text-black focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-xs text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600">
              By continuing, you agree to our{' '}
              <button 
                type="button"
                onClick={() => setShowTerms(true)} 
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Privacy Policy
              </button>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-md transition-colors flex items-center justify-center"
          >
            Login
          </button>
        </form>
      </div>

      <div className="fixed bottom-0 text-center w-full bg-white p-4 shadow-md">
        <span className="text-xs">All rights reserved 2025</span>
      </div>
    </div>
  );
};

export default EmployeeLogin;
