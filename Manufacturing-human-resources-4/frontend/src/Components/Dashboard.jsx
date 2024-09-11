import React, { PureComponent } from "react";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { RiPassPendingLine } from "react-icons/ri";
import { MdOutlinePeopleAlt, MdRemoveRedEye } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { IoCodeDownloadOutline } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
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
import { BsEye } from "react-icons/bs";

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
        <div className="flex  gap-4 p-4 overflow-x-auto   justify-between">
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
          {/* w-full max-w-[430px] max-md:hidden */}
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
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <img
                    src="https://www.byrdie.com/thmb/2_StIwiboKhwe6WiQW3A5_PCjpc=/3000x3000/filters:no_upscale():max_bytes(150000):strip_icc()/1cfaad9e-be47-4755-8d89-9dd27eaf0095_1.3ecc0d85625d5020c4f9807b4d5e7c96-520e913cbf7448878006fb529447fed2.jpg"
                    alt="Product"
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="font-semibold">Shampoo</p>
                </div>
                <p className="font-semibold">$1.99</p>
                <p>18 Sept 2024</p>
                <p className="border border-green-600 w-20 text-center rounded-full text-green-600 bg-green-100 text-sm font-medium">
                  Delivered
                </p>
                <div className="flex gap-2 items-center">
                  <MdRemoveRedEye className="cursor-pointer text-lg" />
                  <CiTrash className="cursor-pointer text-lg text-red-500" />
                </div>
              </div>
              <hr className="mt-2" />
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <img
                    src="https://plazavea.vteximg.com.br/arquivos/ids/23016863-1000-1000/imageUrl_1.jpg?v=638060295883870000"
                    alt="Product"
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="font-semibold">perfume</p>
                </div>
                <p className="font-semibold">$1.99</p>
                <p>18 Sept 2024</p>
                <p className="border border-blue-600 w-20 text-center rounded-full text-blue-600 bg-blue-100 text-sm font-medium">
                  On Going
                </p>
                <div className="flex gap-2 items-center">
                  <MdRemoveRedEye className="cursor-pointer text-lg" />
                  <CiTrash className="cursor-pointer text-lg text-red-500" />
                </div>
              </div>
              <hr className="mt-2" />
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <img
                    src="https://cdn.shopify.com/s/files/1/0314/8555/8922/products/DinnerLady-NicShot-NicShot-100VG-18mg-3pk-UK_1024x1024@2x.jpg?v=1585150206"
                    alt="Product"
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="font-semibold">E-juice</p>
                </div>
                <p className="font-semibold">$1.59</p>
                <p>18 Sept 2024</p>
                <p className="border border-green-600 w-20 text-center rounded-full text-green-600 bg-green-100 text-sm font-medium">
                  Delivered
                </p>
                <div className="flex gap-2 items-center">
                  <MdRemoveRedEye className="cursor-pointer text-lg" />
                  <CiTrash className="cursor-pointer text-lg text-red-500" />
                </div>
              </div>
              <hr className="mt-2" />
              <div className="flex justify-between items-center gap-2 mt-2">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" />
                  <img
                    src="https://i0.wp.com/www.babypromv.com/wp-content/uploads/2019/07/4e2bc5c3-077e-476a-9408-5f06ab2c73bf_1.7f26f2b8c0ccad58fc2a50bd471589f3-1.jpeg?fit=2642,2642&ssl=1"
                    alt="Product"
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="font-semibold">Lotion</p>
                </div>
                <p className="font-semibold">$2.55</p>
                <p>18 Sept 2024</p>
                <p className="border border-red-600 w-20 text-center rounded-full text-red-600 bg-red-100 text-sm font-medium">
                  Canceled
                </p>
                <div className="flex gap-2 items-center">
                  <MdRemoveRedEye className="cursor-pointer text-lg" />
                  <CiTrash className="cursor-pointer text-lg text-red-500" />
                </div>
              </div>
              <hr className="mt-2" />
            </div>
          </div>
          {/* chat */}
          <div className="border max-md:w-full w-[300px] h-[300px] p-5 rounded-lg bg-white mt-5">
            <div className="flex gap-2 items-center mb-4">
              <MdOutlineChat className="text-lg" />
              <p className="font-semibold">Quick Chat</p>
            </div>
            <div className="flex gap-3 items-center">
              <img
                src="https://i.pinimg.com/564x/30/e1/68/30e168340e36e773713698f3051cf875.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">Quack</p>
                  <p className="text-sm text-gray-600">15:23</p>
                </div>
                <p className="text-sm text-gray-600">Hello</p>
              </div>
            </div>
            <div className="flex gap-3 items-center mt-3">
              <img
                src="https://i.pinimg.com/736x/e0/68/21/e06821a26c25c59066d6a4309361bda2.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">Meo</p>
                  <p className="text-sm text-gray-600">14:52</p>
                </div>
                <p className="text-sm text-gray-600">Hello</p>
              </div>
            </div>
            <div className="flex gap-3 items-center mt-3">
              <img
                src="https://i.pinimg.com/564x/4b/fa/f2/4bfaf26416c0aef7c498e38ed1b567fb.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">Lil Kitty</p>
                  <p className="text-sm text-gray-600">14:42</p>
                </div>
                <p className="text-sm text-gray-600">Hello</p>
              </div>
            </div>
            <div className="flex gap-3 items-center mt-3">
              <img
                src="https://i.pinimg.com/564x/78/2a/9b/782a9ba357d834585425bedc618445ce.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">Mi</p>
                  <p className="text-sm text-gray-600">04:30</p>
                </div>
                <p className="text-sm text-gray-600">Hello</p>
              </div>
            </div>
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
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="uv"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="pv"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="amt"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
            </AreaChart>
          </div>
        </div>
      
    </div>
  );
};

export default Dashboard;
