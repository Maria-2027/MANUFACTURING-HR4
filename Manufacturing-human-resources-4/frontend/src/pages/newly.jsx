import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';


const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await axios.post('http://localhost:7688/api/auth/forgot-password', formData);
      setMessage(response.data.message);
      setFormData({
        email: ''
      });
    } catch (error) {
      setIsError(true);
      if (error.response) {
        setMessage(error.response.data.message || 'An error occurred while resetting password');
      } else if (error.request) {
        setMessage('No response received from the server. Please try again later.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && (
        <p className={`message ${isError ? 'error' : 'success'}`}>
          {message}
        </p>
        <Link to 
      )}
    </div>
  );
};

export default ForgotPassword;
