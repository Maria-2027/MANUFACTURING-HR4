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
      <div className="flex justify-center items-center h-screen">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-4 border-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img 
                  src={previewUrl || user.profilePic || defaultAvatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  onError={handleImageError}
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <FaCamera className="text-white" />
                  <input 
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex items-center space-x-6 mb-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaUser />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaCog />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'activity' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaHistory />
                <span>Activity</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-md">
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Full Name</span>
                              <span className="font-medium">{`${user.firstName} ${user.lastName}`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Email</span>
                              <span className="font-medium">{user.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Role</span>
                              <span className="font-medium capitalize">{user.role}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold border-b pb-2">Account Settings</h3>
                          <div className="space-y-4">
                            {selectedFile && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Selected Image</span>
                                <button
                                  onClick={handleUpload}
                                  disabled={uploadLoading}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                                >
                                  {uploadLoading ? 'Uploading...' : 'Upload Photo'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <button 
                    onClick={() => navigate('/settings')}
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Update Profile Settings
                  </button>
                </motion.div>
              )}
              {activeTab === 'activity' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl p-6 shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                  <p className="text-gray-500">No recent activity to show.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

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
    </div>
  );
};

export default ProfilePage;
