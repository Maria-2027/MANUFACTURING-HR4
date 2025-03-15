import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaUser, FaCog, FaHistory } from 'react-icons/fa';

const PROFILE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:7688/api/auth/testLog'
  : 'https://backend-hr4.jjm-manufacturing.com/api/auth/testLog';

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('accessToken');
  const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
      ? 'http://localhost:7688'
      : 'https://backend-hr4.jjm-manufacturing.com',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const [user, setUser] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : {};
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [coverImage, setCoverImage] = useState('/assets/cover-default.jpg');
  
  const defaultAvatar = 'https://i.pinimg.com/736x/ea/21/05/ea21052f12b135e2f343b0c5ca8aeabc.jpg';

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // First try to get data from localStorage
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        setUser(JSON.parse(storedData));
        setError(''); // Clear any existing errors since we have data
      }

      // Then fetch fresh data from API
      const response = await api.get(PROFILE);
      if (response.data) {
        setUser(response.data);
        localStorage.setItem("userData", JSON.stringify(response.data));
        setError(''); // Clear any existing errors
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (error.response?.status === 401) {
        sessionStorage.removeItem('accessToken');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
        return;
      }
      // Only set error if we don't have localStorage data
      if (!localStorage.getItem("userData")) {
        setError(error.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Please upload only JPG, JPEG or PNG files');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size should be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploadLoading(true);

    try {
      const cloudinaryData = new FormData();
      cloudinaryData.append('file', selectedFile);
      cloudinaryData.append('upload_preset', 'profile'); // Update this to your preset name from Cloudinary
      
      const cloudinaryResponse = await fetch(
        'https://api.cloudinary.com/v1_1/dhawghlsr/image/upload',
        {
          method: 'POST',
          body: cloudinaryData,
        }
      );

      const cloudinaryResult = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        console.error('Cloudinary error:', cloudinaryResult); // Add this for debugging
        throw new Error(cloudinaryResult.error?.message || 'Cloudinary upload failed');
      }

      if (cloudinaryResult.secure_url) {
        // Send the Cloudinary URL to your backend
        try {
          // Updated endpoint to match backend route
          const response = await api.post('/api/auth/update-profile-pic', {
            profilePicUrl: cloudinaryResult.secure_url
          });

          if (response.data.success) {
            setUser(prev => ({...prev, profilePic: cloudinaryResult.secure_url}));
            setError('');
            setSuccess('Profile picture updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
            await fetchProfile(); // Refresh profile data
          } else {
            throw new Error('Failed to update profile picture in backend');
          }
        } catch (backendError) {
          setError('Failed to update profile: ' + (backendError.response?.data?.message || backendError.message));
          console.error('Backend error:', backendError);
        }
      }
    } catch (error) {
      setError(`Upload failed: ${error.message}`);
      setPreviewUrl(null);
      console.error('Upload error details:', error);
    } finally {
      setUploadLoading(false);
      setSelectedFile(null);
    }
  };

  const handleImageError = (e) => {
    e.target.src = defaultAvatar;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 border-t-3 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <img 
              src={previewUrl || user.profilePic || defaultAvatar}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
              onError={handleImageError}
            />
            <label className="absolute bottom-0 right-0 bg-gray-100 p-1.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
              <FaCamera className="text-gray-600 text-xs" />
              <input 
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{`${user.firstName} ${user.lastName}`}</h2>
            <p className="text-gray-500 text-sm mb-3">{user.email}</p>
            <div className="flex gap-2">
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={uploadLoading}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Photo'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Personal Information</span>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-gray-600 font-medium">Full Name:</span>
                    <p className="text-gray-800">{`${user.firstName} ${user.lastName}`}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Email:</span>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Role:</span>
                    <p className="text-gray-800 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-500">Employment Details</span>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-gray-600 font-medium">Employee ID:</span>
                    <p className="text-gray-800">{user.employeeId || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Department:</span>
                    <p className="text-gray-800">{user.department || 'Not set'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Position:</span>
                    <p className="text-gray-800">{user.position || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
