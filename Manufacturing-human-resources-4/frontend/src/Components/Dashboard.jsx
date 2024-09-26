import React from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { IoCodeDownloadOutline } from "react-icons/io5";
import { MdRemoveRedEye } from "react-icons/md";
import { CiTrash } from "react-icons/ci";
import { MdOutlineChat } from "react-icons/md";
import {
  AreaChart,
  Area,
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

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
];

const Dashboard = () => {
  return (
    <div className="bg-gray-200 text-black h-auto p-5">
      {/* 4 cards */}
      <p className="font-semibold">Overview</p>
      {/* cards */}
      <div className="flex gap-4 p-4 overflow-x-auto flex-wrap">
        {/* Revenue Card */}
        <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-semibold text-sm">Revenue</p>
            <HiOutlineCurrencyDollar className="text-gray-600 text-xl" />
          </div>
          <div className="flex gap-3 my-3">
            <p className="text-3xl font-bold">$537.83</p>
            <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
              <IoIosArrowUp className="text-green-700" /> 10.8%
            </p>
          </div>
          <div className="my-3">
            <p className="text-green-700 font-semibold">
              +$128.58 <span className="text-gray-500">than past week</span>
            </p>
          </div>
        </div>

        {/* Sales Card */}
        <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-semibold text-sm">Sales</p>
            <GrMoney className="text-gray-600 text-xl" />
          </div>
          <div className="flex gap-3 my-3">
            <p className="text-3xl font-bold">4859</p>
            <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
              <IoIosArrowUp className="text-green-700" /> 18.2%
            </p>
          </div>
          <div className="my-3">
            <p className="text-green-700 font-semibold">
              +47 <span className="text-gray-500">than past week</span>
            </p>
          </div>
        </div>

        {/* Customer Card */}
        <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-semibold text-sm">Customer</p>
            <MdOutlinePeopleAlt className="text-gray-600 text-xl" />
          </div>
          <div className="flex gap-3 my-3">
            <p className="text-3xl font-bold">2235</p>
            <p className="flex items-center gap-1 bg-red-100 text-red-700 rounded-full px-3 py-1 text-sm font-semibold">
              <IoIosArrowDown className="text-red-700" /> 12.4%
            </p>
          </div>
          <div className="my-3">
            <p className="text-red-700 font-semibold">
              -215 <span className="text-gray-500">than past week</span>
            </p>
          </div>
        </div>

        {/* Spending Card */}
        <div className="bg-white shadow-lg w-[280px] p-5 rounded-lg mt-3 transition-transform transform hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-semibold text-sm">Spending</p>
            <RiPassPendingLine className="text-gray-600 text-xl" />
          </div>
          <div className="flex gap-3 my-3">
            <p className="text-3xl font-bold">$219.65</p>
            <p className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold">
              <IoIosArrowUp className="text-green-700" /> 9.1%
            </p>
          </div>
          <div className="my-3">
            <p className="text-green-700 font-semibold">
              +$88.67 <span className="text-gray-500">than past week</span>
            </p>
          </div>
        </div>
      </div>

      {/* charts */}
      <div className="flex gap-4 p-4 overflow-x-auto justify-between">
        <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0 md:flex-1 ">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 50,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </div>

        {/* Bar charts */}
        <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0 md:flex-1 ">
          <BarChart
            width={430}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="pv"
              fill="#8884d8"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
            <Bar
              dataKey="uv"
              fill="#82ca9d"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
            />
          </BarChart>
        </div>
      </div>

      {/* 3 cards */}
      <div className="flex gap-5 flex-wrap">
        {/* Recent Orders */}
        <div className="mt-5 rounded-lg bg-white w-[500px] h-auto md:h-[100%] p-4  ">
          <div className="flex justify-between">
            <p className="font-semibold text-black/90">Recent Orders</p>
            <p className="flex gap-1 items-center p-1 rounded-lg bg-gray-200 cursor-pointer">
              <IoCodeDownloadOutline className="text-lg" />
              Report
            </p>
          </div>

          <div className="flex justify-between mt-4 text-black/75">
            <div className="flex gap-12 items-center">
              <input type="checkbox" />
              <p>Product</p>
            </div>
            <p>Price</p>
            <p>Date</p>
            <p className="ml-14">Status</p>
            <p className="mr-1">Action</p>
          </div>

          <hr className="mt-2" />
          <div>
            {/* Order items */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-3 items-center">
                <input type="checkbox" />
                <p className="text-black/80">#857564564</p>
                <p className="text-black/50">Product Name</p>
              </div>
              <p className="text-black/80">$105.00</p>
              <p className="text-black/80">2023-09-01</p>
              <p className="text-black/80">Pending</p>
              <p>
                <CiTrash className="text-red-500 cursor-pointer" />
              </p>
            </div>
          </div>
          {/* Add more order items as needed */}
        </div>

        {/* Messages */}
        <div className="mt-5 rounded-lg bg-white w-[500px] h-auto md:h-[100%] p-4">
          <div className="flex justify-between">
            <p className="font-semibold text-black/90">Messages</p>
            <p className="flex gap-1 items-center p-1 rounded-lg bg-gray-200 cursor-pointer">
              <MdOutlineChat className="text-lg" />
              View All
            </p>
          </div>
          <div className="flex justify-between mt-4 text-black/75">
            <p>Message</p>
            <p>Date</p>
            <p>Action</p>
          </div>
          <hr className="mt-2" />
          <div>
            {/* Message items */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-black/80">Hello! How can I help you?</p>
              <p className="text-black/80">2023-09-01</p>
              <p>
                <CiTrash className="text-red-500 cursor-pointer" />
              </p>
            </div>
          </div>
          {/* Add more message items as needed */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
