import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { SyncLoader } from "react-spinners";
import layoutImage from "../Components/Assets/layout.jpg";
import axios from 'axios';
import { MetroSpinner } from 'react-spinners-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADMINLOGIN = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/auth/testLog"
  : "https://backend-hr4.jjm-manufacturing.com/api/auth/testLog";

const TWO_FA_BASE_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:7688/api/authenticator"
  : "https://backend-hr4.jjm-manufacturing.com/api/authenticator";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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

      console.log('Sending login request:', requestData); // Debug log

      const response = await axios.post(ADMINLOGIN, requestData);
      
      console.log('Login response:', response.data); // Debug log

      if (response.data && response.data.token) {
        const userRole = response.data.user?.role?.toLowerCase();
        if (!["admin", "superadmin"].includes(userRole)) {
          toast.error("Access denied. Only Administrators can login here.");
          throw new Error("Access denied. Only Administrators can login here.");
        }

        // Show success message first
        toast.success("Login successful! Preparing 2FA verification...");

        // Store credentials temporarily
        sessionStorage.setItem("tempAuthData", JSON.stringify({
          token: response.data.token,
          user: response.data.user
        }));

        // Add a delay before showing 2FA
        setTimeout(async () => {
          try {
            await axios.post(`${TWO_FA_BASE_URL}/send-2fa-code`, {
              email: formData.email
            });
            setShow2FA(true);
            setIsCodeSent(true);
            toast.info("A verification code has been sent to your email.", {
              position: "top-center",
              autoClose: 5000,
              theme: "colored",
            });
          } catch (error) {
            toast.error("Failed to send verification code. Please try again.");
            sessionStorage.removeItem("tempAuthData");
          }
          setLoading(false);
        }, 1500); // 1.5 second delay
        return; // Exit early to prevent setLoading(false) in finally block
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.error || 
                          error.message === "Access denied. Only Administrators can login here."
                            ? error.message 
                            : "Invalid email or password";
      
      toast.error(errorMessage);
      // Clear any temporary data if login fails
      sessionStorage.removeItem("tempAuthData");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${TWO_FA_BASE_URL}/verify-2fa-code`, {
        email: formData.email,
        code: verificationCode
      });

      if (response.status === 200) {
        const tempAuthData = JSON.parse(sessionStorage.getItem("tempAuthData"));
        
        if (!tempAuthData) {
          throw new Error("Login session expired. Please login again.");
        }

        // Only now set the actual authentication data after 2FA verification
        sessionStorage.setItem("accessToken", tempAuthData.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(tempAuthData.user));
        
        // Clean up temporary data
        sessionStorage.removeItem("tempAuthData");

        toast.success("Login successful! Please wait...");
        setTimeout(() => navigate("/admin-dashboard"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid verification code");
      if (error.message === "Login session expired. Please login again.") {
        setShow2FA(false); // Return to login form
        setFormData({ email: "", password: "", rememberMe: false });
      }
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen flex items-center justify-center bg-base-500 bg-green-100 bg-opacity-25">
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
      <div className="bg-white rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.25)] p-10 w-full max-w-sm">
        <div className="flex justify-center gap-x-2 pb-2">
          <img
            src={layoutImage}
            alt="jjm logo"
            className="w-12 h-12 rounded-full border-2"
          />
          <h2 className="text-3xl font-bold text-center text-gray-800 mt-1">
            ADMIN LOGIN
          </h2>
        </div>

        {!show2FA ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full p-3 border border-gray-300 dark:bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                required
              />
            </div>

            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-green-500">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full p-3 rounded focus:outline-none dark:bg-white"
                  required
                />
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-500" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-600 text-center">
                By continuing, you agree to our{' '}
                <button 
                  type="button"
                  onClick={() => setShowTerms(true)} 
                  className="text-green-600 hover:underline focus:outline-none"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-green-600 hover:underline focus:outline-none"
                >
                  Privacy Policy
                </button>
              </p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <MetroSpinner size={20} color="white" loading={true} />
              ) : (
                'Login'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="input input-bordered w-full p-3 border border-gray-300 dark:bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                placeholder="Enter 6-digit code"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <MetroSpinner size={20} color="white" loading={true} />
              ) : (
                'Verify Code'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
