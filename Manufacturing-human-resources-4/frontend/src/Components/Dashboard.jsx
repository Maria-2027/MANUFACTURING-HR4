import React from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { MdOutlinePeopleAlt, MdRemoveRedEye } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { IoCodeDownloadOutline } from "react-icons/io5";
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
   console.log("Dashboard rendered");

  return (
    <div className="bg-gray-200 text-black h-auto p-5">
      <p className="font-semibold">Overview</p>
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
        <div className="border bg-white/70 p-2 rounded-lg flex-shrink-0  md:flex-1 ">
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

      {/* Quick Chat */}
<div className="border max-md:w-full w-[300px] h-[300px] p-5 rounded-lg bg-white mt-5">
  <div className="flex gap-2 items-center mb-4">
    <MdOutlineChat className="text-lg" />
    <p className="font-semibold">Quick Chat</p>
  </div>
  {["Quack", "Meo", "Lil Kitty", "Mi"].map((name, index) => (
    <div className="flex gap-3 items-center mt-3" key={index}>
      <img
        src={`https://via.placeholder.com/40`} // Use placeholder for testing
        alt="Profile"
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-sm text-gray-600">{`15:23`}</p>
        </div>
        <p className="text-sm text-gray-600">Hello</p>
      </div>
    </div>
  ))}
</div>

      {/* Top Countries */}
      <div className="mt-5 bg-white rounded-xl max-md:hidden">
        <AreaChart
          width={430}
          height={300}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </div>
    </div>
  );
};

export default Dashboard;
