import React from 'react';

const EmployeeRecords = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Employee Records</h1>
      <p className="text-gray-700">Manage and view employee details here.</p>
      
      <div className="mt-6 bg-white p-4 shadow rounded-lg">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Employee ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Department</th>
              <th className="border border-gray-300 p-2">Position</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder for dynamic employee data */}
            <tr>
              <td className="border border-gray-300 p-2">E001</td>
              <td className="border border-gray-300 p-2">John Doe</td>
              <td className="border border-gray-300 p-2">HR</td>
              <td className="border border-gray-300 p-2">Manager</td>
              <td className="border border-gray-300 p-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeRecords;
