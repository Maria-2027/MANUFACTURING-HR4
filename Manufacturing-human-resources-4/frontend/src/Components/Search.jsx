import React, { useState, useEffect, useRef } from "react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";

const Search = () => {
  // State to toggle notification dropdown and unread count
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Example: 3 unread notifications
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // Profile dropdown state
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close dropdowns when clicking outside of them
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

  // Toggle notification dropdown
  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
    setUnreadNotifications(0); // Mark all notifications as read when opening
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  return (
    <div className={`w-full p-5 h-[85px] rounded-l-sm sticky top-0 z-50 bg-white text-black/70`}>
      <div className="flex justify-between max-md:flex max-md:justify-end">
        <div className="flex gap-5 items-center w-[600px] max-md:hidden">
          {/* Sidebar toggle button */}
          <RiMenuFold2Fill className="text-lg cursor-pointer" />

          {/* Search form */}
          <form className="flex items-center max-w-lg w-full">
            <label htmlFor="voice-search" className="sr-only">Search</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 21 21"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="voice-search"
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 duration-200`}
                placeholder="Search Stocks, Prices, Sell..."
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 end-0 flex items-center pe-3 duration-200"
              >
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
                  />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              Search
            </button>
          </form>
        </div>

        {/* Right-side icons and user profile */}
        <div className="flex gap-3 items-center">
          {/* Notification Icon with Dropdown */}
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
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 z-50 transition-all transform origin-top-right duration-300 scale-100 opacity-100 ease-out">
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
                  <Link
                    to="/notifications"
                    className="text-blue-500 text-sm hover:underline"
                  >
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

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <img
              src="https://i.pinimg.com/736x/ea/21/05/ea21052f12b135e2f343b0c5ca8aeabc.jpg"
              tabIndex={0}
              role="button"
              alt="user"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={toggleProfileDropdown}
            />
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-3 z-50 transition-all transform origin-top-right duration-300 scale-100 opacity-100 ease-out">
                <Link to="/profile" className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                  Profile
                </Link>
                <Link to="/settings" className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                  Settings
                </Link>
                <Link to="/login" className="block text-sm text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition cursor-pointer">
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
