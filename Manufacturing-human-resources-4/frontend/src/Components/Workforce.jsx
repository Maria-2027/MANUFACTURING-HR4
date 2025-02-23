import React, { useState, useEffect } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdOutlinePeopleAlt, MdOutlineChat } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Rectangle } from "recharts";

// Dummy data for charts (Employee Data)
const data = [
  { name: "Jan", active: 4000, inactive: 2400, turnover: 1000 },
  { name: "Feb", active: 3500, inactive: 2200, turnover: 800 },
  { name: "Mar", active: 4200, inactive: 2100, turnover: 950 },
  { name: "Apr", active: 4800, inactive: 1800, turnover: 1200 },
];

const EmployeeAnalytics = () => {
  const [loading, setLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  if (loading) {
    // Custom loading spinner design
    return (
      <div className="container mx-auto p-8 bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-black h-auto p-5">
      <p className="font-semibold text-lg mb-4">Employee Analytics Overview</p>

      {/* Employee Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {/* Total Employees Card */}
        <Card title="Total Employees" value="2,356" icon={<HiOutlineUserGroup />} change="5.3%" changeType="increase" />
        {/* New Hires Card */}
        <Card title="New Hires" value="120" icon={<MdOutlinePeopleAlt />} change="8.5%" changeType="increase" />
        {/* Employee Satisfaction Card */}
        <Card title="Employee Satisfaction" value="87%" icon={<FaRegCalendarCheck />} change="2.1%" changeType="increase" />
        {/* Employee Turnover Card */}
        <Card title="Employee Turnover" value="3.2%" icon={<IoIosArrowDown />} change="1.4%" changeType="decrease" />
      </div>

      {/* Charts Section */}
      <div className="flex gap-4 p-4 overflow-x-auto">
        <ChartContainer title="Employee Engagement Over Time">
          <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 50, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="active" stroke="#82ca9d" />
            <Line type="monotone" dataKey="inactive" stroke="#8884d8" />
          </LineChart>
        </ChartContainer>

        <ChartContainer title="Employee Turnover">
          <BarChart width={430} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="turnover" fill="#ff6b6b" activeBar={<Rectangle fill="lightcoral" stroke="red" />} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Recent Employee Activities and Notifications Section */}
      <div className="flex gap-5 flex-wrap">
        <RecentActivities />
        <Notifications />
      </div>
    </div>
  );
};

// Card Component
const Card = ({ title, value, icon, change, changeType }) => (
  <div className="bg-white shadow-lg p-5 rounded-lg transition-transform transform hover:scale-105 hover:shadow-xl">
    <div className="flex items-center justify-between">
      <p className="text-gray-600 font-semibold text-sm">{title}</p>
      {icon}
    </div>
    <div className="flex gap-3 my-3">
      <p className="text-3xl font-bold">{value}</p>
      <p className={`flex items-center gap-1 ${changeType === "increase" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} rounded-full px-3 py-1 text-sm font-semibold`}>
        {changeType === "increase" ? <IoIosArrowUp /> : <IoIosArrowDown />} {change}
      </p>
    </div>
    <div className="my-3">
      <p className={`font-semibold ${changeType === "increase" ? "text-green-700" : "text-red-700"}`}>
        {changeType === "increase" ? "+" : "-"} {changeType === "increase" ? `+${Math.abs(Number(change))}` : `${Math.abs(Number(change))}`} <span className="text-gray-500">from last month</span>
      </p>
    </div>
  </div>
);

// Chart Container Component
const ChartContainer = ({ title, children }) => (
  <div className="border bg-white rounded-lg p-4 flex-shrink-0 md:flex-1">
    <p className="font-semibold text-lg mb-2">{title}</p>
    {children}
  </div>
);

// Recent Activities Component
const RecentActivities = () => (
  <div className="mt-5 rounded-lg bg-white w-full p-4">
    <div className="flex justify-between">
      <p className="font-semibold text-black/90">Recent Employee Activities</p>
      <p className="flex gap-1 items-center p-1 rounded-lg bg-gray-200 cursor-pointer">
        <IoIosArrowUp className="text-black/90" /> View All
      </p>
    </div>
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <p>Employee</p>
        <p>Activity</p>
        <p>Status</p>
      </div>
      {["John Doe", "Jane Smith", "Mike Johnson"].map((name, index) => (
        <div className="flex justify-between" key={index}>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-sm font-medium">Completed Training</p>
          <p className={`flex gap-1 items-center text-sm font-medium ${index % 2 === 0 ? "text-green-700" : "text-blue-700"}`}>
            <span className={`rounded-full w-2 h-2 ${index % 2 === 0 ? "bg-green-500" : "bg-blue-500"}`}></span>
            <span>{index % 2 === 0 ? "Completed" : "Pending"}</span>
          </p>
        </div>
      ))}
    </div>
  </div>
);

// Notifications Component
const Notifications = () => (
  <div className="mt-5 rounded-lg bg-white w-full p-4">
    <p className="font-semibold text-black/90">Notifications</p>
    <div className="mt-3 flex flex-col gap-2">
      {["New hire: John Doe", "Your training session is scheduled", "Team meeting at 2 PM"].map((notification, index) => (
        <div className="flex items-center gap-2" key={index}>
          <MdOutlineChat className="text-gray-600" />
          <p className="text-sm">{notification}</p>
        </div>
      ))}
    </div>
  </div>
);

export default EmployeeAnalytics;
