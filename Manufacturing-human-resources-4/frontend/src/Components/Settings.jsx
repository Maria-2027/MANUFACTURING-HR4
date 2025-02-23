import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SettingsPage = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('accessToken');
  const api = axios.create({
    baseURL: 'http://localhost:7688',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const [activeTab, setActiveTab] = useState('personal'); // Default tab: Personal Info
  const [user, setUser] = useState({ username: '', email: '' });
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/auth/profile');
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/api/auth/update-profile', user);
      if (response.data.success) {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      const response = await api.put('/api/auth/change-password', {
        oldPassword,
        newPassword
      });
      if (response.data.success) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('Password updated successfully!');
      }
    } catch (error) {
      setPasswordError('Failed to update password');
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Settings</h1>
      <div className="flex space-x-4 border-b mb-6">
        <button className={`p-2 ${activeTab === 'personal' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`} onClick={() => setActiveTab('personal')}>Personal Information</button>
        <button className={`p-2 ${activeTab === 'password' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`} onClick={() => setActiveTab('password')}>Change Password</button>
      </div>

      {activeTab === 'personal' && (
        <form onSubmit={handleSavePersonalInfo} className="space-y-4">
          <p className="text-gray-700 dark:text-white">Update Your Information</p>
          <input type="text" placeholder="Username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="email" placeholder="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg" />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg">Save Changes</button>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <p className="text-gray-700 dark:text-white">Change Your Password</p>
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded-lg">Change Password</button>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
