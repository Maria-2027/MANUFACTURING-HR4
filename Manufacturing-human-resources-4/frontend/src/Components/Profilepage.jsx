import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/auth/profile');
      if (response.data && response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePic', file);
    
    try {
      const response = await api.post('/api/auth/upload-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setProfilePic(URL.createObjectURL(file));
        fetchProfile();
      } else {
        setError('Failed to upload profile picture');
        console.error('Upload failed:', response.data);
      }
    } catch (error) {
      setError('Failed to upload profile picture');
      console.error('Upload error:', error.response?.data || error.message);
    }
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
      {error ? (
        <div className="bg-red-500 text-white p-4 rounded-lg">{error}</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6 w-96">
          <h1 className="text-2xl font-bold text-center mb-4">Profile Page</h1>
          <div className="flex flex-col items-center">
            <img src={profilePic || user.profilePic || 'https://via.placeholder.com/150'} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
            <input type="file" accept="image/*" onChange={handleProfilePicChange} className="mb-4" />
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
      )}
    </div>
  );
};

export default ProfilePage;
