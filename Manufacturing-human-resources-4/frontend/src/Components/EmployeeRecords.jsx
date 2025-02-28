import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed

const EmployeeRecords = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Replace with your actual API URL
    axios.get("https://your-api.com/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Employee Records</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Position</th>
            <th className="py-2 px-4 border">Department</th>
            <th className="py-2 px-4 border">Date Hired</th>
            <th className="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="text-center border">
              <td className="py-2 px-4 border">{employee.id}</td>
              <td className="py-2 px-4 border">{employee.name}</td>
              <td className="py-2 px-4 border">{employee.position}</td>
              <td className="py-2 px-4 border">{employee.department}</td>
              <td className="py-2 px-4 border">{employee.dateHired}</td>
              <td className={`py-2 px-4 border font-bold ${
                employee.status === "Active" ? "text-green-600" : "text-red-600"
              }`}>
                {employee.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeRecords;
