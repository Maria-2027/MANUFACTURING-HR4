import React, { useEffect, useState } from 'react';

const EmployeeRecords = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee data when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:7688/api/employees", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Assuming the server returns an array of employee objects
        setEmployees(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            {/* Dynamically generate rows from employee data */}
            {employees.map((employee) => (
              <tr key={employee._id}> {/* Assuming _id is the unique identifier */}
                <td className="border border-gray-300 p-2">{employee._id}</td>
                <td className="border border-gray-300 p-2">{employee.firstname} {employee.lastname}</td>
                <td className="border border-gray-300 p-2">N/A</td> {/* Replace with actual department */}
                <td className="border border-gray-300 p-2">N/A</td> {/* Replace with actual position */}
                <td className="border border-gray-300 p-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeRecords;
