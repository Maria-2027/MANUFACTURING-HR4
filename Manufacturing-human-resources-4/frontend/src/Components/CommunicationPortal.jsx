import React, { useState } from 'react';

const EmployeeChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Welcome to the team!", sender: "Admin" },
    { text: "Hello! How's everyone doing today?", sender: "Employee1" }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message) return;

    const newMessage = {
      text: message,
      sender: 'Employee', // You can replace this with dynamic user info
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto bg-white rounded-lg shadow-xl p-4">
      <div className="mb-3">
        <h1 className="text-xl font-semibold text-center text-gray-800">Employee ChatBox</h1>
      </div>

      {/* Chat Messages Section */}
      <div className="flex flex-col space-y-3 overflow-y-auto max-h-80 p-3 bg-gray-50 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start ${msg.sender === 'Admin' ? 'justify-start' : 'justify-end'}`}>
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === 'Admin' ? 'bg-blue-100 text-gray-800' : 'bg-blue-500 text-white'}`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Section */}
      <form onSubmit={handleSendMessage} className="flex items-center mt-4 space-x-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default EmployeeChatBox;
