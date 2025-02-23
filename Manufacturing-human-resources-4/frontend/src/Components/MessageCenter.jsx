import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Make sure to install axios if you haven't already

const MessageCenter = () => {
  const [messageData, setMessageData] = useState({
    recipient: '',
    subject: '',
    message: '',
  });

  const [employees, setEmployees] = useState([]); // State to store employee list
  const [filteredEmployees, setFilteredEmployees] = useState([]); // State for filtered employees
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Mock employee list (you can replace this with an API call to get actual employees)
  const employeeList = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  ];

  useEffect(() => {
    // Set the initial employee list
    setEmployees(employeeList);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageData({ ...messageData, [name]: value });

    // Filter employees based on input
    if (name === 'recipient') {
      const filtered = employees.filter((employee) =>
        employee.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage('');
    setIsError(false);

    try {
      const response = await axios.post('http://localhost:7688/api/messages/send', messageData);
      setResponseMessage(response.data.message);
      setMessageData({
        recipient: '',
        subject: '',
        message: '',
      });
      setFilteredEmployees([]); // Clear filtered employees after sending
    } catch (error) {
      setIsError(true);
      if (error.response) {
        setResponseMessage(error.response.data.message || 'An error occurred while sending the message');
      } else {
        setResponseMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="message-center-form container mx-auto p-8 bg-gray-200 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-6">Message Center</h2>
      <p className="text-lg text-center mb-4">Send and receive messages from team members in real-time.</p>
      
      {/* Inbox Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => navigate('/Inbox')} // Navigate to the inbox page
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg"
        >
          Go to Inbox
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="recipient">
            Recipient
          </label>
          <input
            type="text"
            name="recipient"
            value={messageData.recipient}
            onChange={handleChange}
            placeholder="Start typing a name..."
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {filteredEmployees.length > 0 && (
            <ul className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto bg-white">
              {filteredEmployees.map((employee) => (
                <li
                  key={employee.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setMessageData({ ...messageData, recipient: employee.name });
                    setFilteredEmployees([]); // Clear the list after selection
                  }}
                >
                  {employee.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={messageData.subject}
            onChange={handleChange}
            placeholder="Enter message subject"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            name="message"
            value={messageData.message}
            onChange={handleChange}
            placeholder="Write your message here"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="5"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-lg"
          >
            Send Message
          </button>
        </div>
      </form>
      {responseMessage && (
        <p className={`message ${isError ? 'text-red-500' : 'text-green-500'} text-center mt-4`}>
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default MessageCenter;
