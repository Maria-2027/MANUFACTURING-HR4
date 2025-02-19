import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inbox = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      _id: '1',
      subject: 'Project Update',
      message: 'The project deadline has been extended by one week.',
      sender: 'Alice Johnson',
      timestamp: new Date().toISOString(),
    },
    {
      _id: '2',
      subject: 'Meeting Reminder',
      message: 'Don’t forget about the meeting scheduled for tomorrow at 10 AM.',
      sender: 'Bob Smith',
      timestamp: new Date().toISOString(),
    },
    {
      _id: '3',
      subject: 'Feedback Request',
      message: 'Please provide your feedback on the recent presentation.',
      sender: 'Charlie Brown',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Replace the following line with your API call
        // const response = await axios.get(`http://localhost:7688/api/messages/inbox/${user.username}`);
        // setMessages(response.data);

        // Simulate a loading time for demonstration
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Error fetching messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user.username]);

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="inbox container mx-auto p-8 bg-gray-200 min-h-screen">
      <h2 className="text-4xl font-bold mb-6">Inbox</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="font-bold">{msg.subject}</h3>
            <p>{msg.message}</p>
            <p className="text-gray-500 text-sm">From: {msg.sender} | Received: {new Date(msg.timestamp).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Inbox;
