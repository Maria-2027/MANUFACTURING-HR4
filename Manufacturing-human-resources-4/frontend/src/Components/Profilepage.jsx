import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PROFILE = process.env.NODE_ENV === 'development'
  ? 'http://localhost:7688/api/auth/profile'
  : 'https://backend-hr4.jjm-manufacturing.com/api/auth/profile';

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('accessToken');
  const api = axios.create({
    baseURL: 'http://localhost:7688',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [profilePic, setProfilePic] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const defaultAvatar = '/assets/default-avatar.png'; // Make sure this image exists in your public folder

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get(PROFILE);
      if (response.data && response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load profile');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        {error && (
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
            {success}
          </div>
        )}
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Profile Page</h1>
        <div className="flex flex-col items-center">
          <div className="relative">
            <img 
              src={previewUrl || user.profilePic || defaultAvatar} 
              alt="Profile" 
              className="w-24 h-24 rounded-full mb-4 object-cover"
              onError={handleImageError}
            />
            {uploadLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
              </div>
            )}
          </div>
          <div className="flex gap-2 mb-4">
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              <span>Choose File</span>
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/jpg" 
                onChange={handleFileSelect} 
                className="hidden"
              />
            </label>
            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploadLoading}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-green-300"
              >
                {uploadLoading ? 'Uploading...' : 'Upload Picture'}
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">First Name: <span className="font-normal">{user.firstname}</span></p>
          <p className="text-lg font-semibold text-gray-700">Last Name: <span className="font-normal">{user.lastname}</span></p>
          <p className="text-lg font-semibold text-gray-700">Username: <span className="font-normal">{user.username}</span></p>
          <p className="text-lg font-semibold text-gray-700">Email: <span className="font-normal">{user.email}</span></p>
          <p className="text-lg font-semibold text-gray-700">Phone: <span className="font-normal">{user.phone}</span></p>
          <p className="text-lg font-semibold text-gray-700">Address: <span className="font-normal">{user.address}</span></p>
          <p className="text-lg font-semibold text-gray-700">Role: <span className="font-normal">{user.role}</span></p>
        </div>
        
        <button 
          onClick={() => navigate('/settings')} 
          className="w-full bg-blue-500 text-white p-2 rounded-lg mt-4 hover:bg-blue-600"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
