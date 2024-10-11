import React, { useState, useEffect } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { MdOutlinePeopleAlt, MdOutlineChat } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { IoCodeDownloadOutline } from "react-icons/io5";
import { CiTrash } from "react-icons/ci";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";

// Dummy data for charts
const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
];

const Dashboard = () => {
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
      <p className="font-semibold text-lg mb-4">Overview</p>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {/* Revenue Card */}
        <Card title="Revenue" value="$537.83" icon={<HiOutlineCurrencyDollar />} change="10.8%" changeType="increase" />
        {/* Sales Card */}
        <Card title="Sales" value="4859" icon={<GrMoney />} change="18.2%" changeType="increase" />
        {/* Customer Card */}
        <Card title="Customers" value="2235" icon={<MdOutlinePeopleAlt />} change="12.4%" changeType="decrease" />
        {/* Spending Card */}
        <Card title="Spending" value="$219.65" icon={<RiPassPendingLine />} change="9.1%" changeType="increase" />
      </div>

      {/* Charts Section */}
      <div className="flex gap-4 p-4 overflow-x-auto">
        <ChartContainer title="Line Chart">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ChartContainer>

        <ChartContainer title="Bar Chart">
          <BarChart
            width={430}
            height={300}
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Recent Orders and Notifications Section */}
      <div className="flex gap-5 flex-wrap">
        <RecentOrders />
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
        {changeType === "increase" ? "+" : "-"} {changeType === "increase" ? `+${Math.abs(Number(change))}` : `${Math.abs(Number(change))}`} <span className="text-gray-500">than past week</span>
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

// Recent Orders Component
const RecentOrders = () => (
  <div className="mt-5 rounded-lg bg-white w-full p-4">
    <div className="flex justify-between">
      <p className="font-semibold text-black/90">Recent Orders</p>
      <p className="flex gap-1 items-center p-1 rounded-lg bg-gray-200 cursor-pointer">
        <IoCodeDownloadOutline className="text-black/90" /> Export
      </p>
    </div>
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex justify-between text-sm font-semibold text-gray-500">
        <p>Order No</p>
        <p>Product</p>
        <p>Status</p>
        <p>Action</p>
      </div>
      {[1048, 1049, 1050].map((orderNo, index) => (
        <div className="flex justify-between" key={index}>
          <p className="text-sm font-medium">{orderNo}</p>
          <p className="text-sm font-medium">Product {index + 1}</p>
          <p className={`flex gap-1 items-center text-sm font-medium ${index % 2 === 0 ? "text-green-700" : "text-red-700"}`}>
            <span className={`rounded-full w-2 h-2 ${index % 2 === 0 ? "bg-green-500" : "bg-red-500"}`}></span>
            <span>{index % 2 === 0 ? "Delivered" : "Pending"}</span>
          </p>
          <p className="text-red-700 text-sm font-medium cursor-pointer">
            <CiTrash />
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
      {["You have 2 new messages", "Your order has been shipped", "Reminder: Team meeting at 3 PM"].map((notification, index) => (
        <div className="flex items-center gap-2" key={index}>
          <MdOutlineChat className="text-gray-600" />
          <p className="text-sm">{notification}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;
