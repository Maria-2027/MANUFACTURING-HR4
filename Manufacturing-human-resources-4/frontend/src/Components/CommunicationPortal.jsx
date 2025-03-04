import React, { useState, useEffect } from 'react';
import websocketService from '../services/websocket';

const EmployeeChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId] = useState(() => `employee-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();

    // Subscribe to messages
    const unsubscribe = websocketService.subscribe((newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    return () => unsubscribe();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      text: message,
      sender: 'Employee',
      userId: userId,
      timestamp: new Date().toISOString()
    };

    websocketService.sendMessage(newMessage);
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
