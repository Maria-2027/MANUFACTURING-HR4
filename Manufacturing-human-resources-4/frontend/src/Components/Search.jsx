import React, { useState, useEffect, useRef } from "react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePage from './Profilepage'; // Add this import

const Search = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
    setUnreadNotifications(0);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleSelectionChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    if (selectedValue) {
      navigate(selectedValue);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate('/'); // Navigate to login page after logout
  };

  const openProfileModal = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(true);
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <div className="w-full p-5 h-[85px] rounded-l-sm sticky top-0 z-50 bg-white text-black/70 shadow-md">
        <div className="flex justify-between items-center max-md:flex max-md:justify-end">
          {/* Left Side: Menu and Search */}
          <div className="flex gap-5 items-center w-[600px] max-md:hidden">
            <RiMenuFold2Fill className="text-lg cursor-pointer" />

            <form className="flex items-center max-w-lg w-full">
              <label htmlFor="search-options" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <select
                  id="search-options"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-300 ease-in-out"
                  value={selectedOption}
                  onChange={handleSelectionChange}
                >
                  <option value="" disabled>
                    Choose an option
                  </option>
                  <option value="/dashboard">Go to Dashboard</option>
                  <option value="/profile">Profile Page</option>
                  <option value="/settings">Settings</option>
                  <option value="/notifications">Notifications</option>
                </select>
              </div>
            </form>
          </div>

          {/* Right Side: Notification & Profile */}
          <div className="flex gap-4 items-center">
            {/* Notification Icon */}
            <div className="relative" ref={dropdownRef}>
              <div className="relative cursor-pointer" onClick={toggleNotification}>
                <IoMdNotificationsOutline className="text-xl" aria-label="Notifications" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-ping">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 z-50 transition-all duration-300 ease-in-out">
                  <h3 className="text-sm font-semibold mb-2">Notifications</h3>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                      <p className="font-medium">New message from John</p>
                      <span className="text-xs text-gray-400">2 minutes ago</span>
                    </li>
                    <li className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                      <p className="font-medium">System update available</p>
                      <span className="text-xs text-gray-400">1 hour ago</span>
                    </li>
                    <li className="text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                      <p className="font-medium">Reminder: Meeting at 3 PM</p>
                      <span className="text-xs text-gray-400">Today at 2:30 PM</span>
                    </li>
                  </ul>
                  <div className="text-right mt-3">
                    <Link to="/notifications" className="text-blue-500 text-sm hover:underline">
                      See all notifications
                    </Link>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-500 text-xs hover:underline ml-3"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <img
                src="https://i.pinimg.com/736x/ea/21/05/ea21052f12b135e2f343b0c5ca8aeabc.jpg"
                tabIndex={0}
                role="button"
                alt="user"
                className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                onClick={toggleProfileDropdown}
              />
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-3 z-50 transition-all duration-300 ease-in-out">
                  <a onClick={openProfileModal} className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                    Profile
                  </a>
                  <Link to="/settings" className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Profile</h2>
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                {/* Insert ProfilePage content here */}
                <ProfilePage />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Search;
