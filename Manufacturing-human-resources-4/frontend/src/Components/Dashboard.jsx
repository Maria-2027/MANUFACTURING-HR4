import React, { useState, useEffect } from 'react';
import { FaUserAlt, FaTasks, FaRegComment, FaUsers } from 'react-icons/fa';
import { SyncLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [firstName, setFirstName] = useState(''); // Changed from userName to firstName

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setFirstName(user.firstName || 'User'); // Set a default value if firstName is not available
      console.log('User data loaded:', user); // Debug log
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString());
      const hours = now.getHours();
      // Only set greeting if firstName is available
      if (firstName) {
        if (hours < 12) {
          setGreeting(`Good Morning, ${firstName}`);
        } else if (hours < 18) {
          setGreeting(`Good Afternoon, ${firstName}`);
        } else {
          setGreeting(`Good Evening, ${firstName}`);
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [firstName]); // Changed dependency from userName to firstName

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100">
        <div className="flex flex-col items-center">
          <SyncLoader
            cssOverride={{}}
            loading
            color="#000000"
            margin={12}
            size={15}
            speedMultiplier={0.5}
          />
          <p className="text-gray-800 text-xl mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-blue-50 to-pink-50 min-h-screen flex flex-col items-center justify-center space-y-12 px-6"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center p-10 bg-white shadow-2xl rounded-3xl max-w-3xl space-y-6"
      >
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-gray-800 mb-4"
        >
          {firstName ? greeting : 'Welcome'} {/* Add fallback greeting */}
        </motion.h1>
        <p className="text-xl text-gray-600">
          Welcome to JJM Manufacturing's Employee HR Portal! Here, you can manage your work tasks, view company updates, and stay engaged with the team.
        </p>

        <div className="text-lg text-gray-600">
          <p>Current Time:</p>
          <p className="font-mono text-xl text-gray-900">{currentTime}</p>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-6xl mx-auto"
      >
        {[
          { icon: <FaUsers className="text-4xl text-blue-600 mb-4" />, title: "Grievance Management", desc: "Submit and resolve employee grievances in a confidential and efficient manner, ensuring fair treatment for all employees." },
          { icon: <FaUserAlt className="text-4xl text-green-600 mb-4" />, title: "Employee Engagement", desc: "Engage with employees through feedback, surveys, and activities that help improve morale and overall job satisfaction." },
          { icon: <FaRegComment className="text-4xl text-purple-600 mb-4" />, title: "Employee Communication", desc: "Maintain open channels of communication between management and employees, fostering a culture of transparency and trust." },
          { icon: <FaTasks className="text-4xl text-orange-600 mb-4" />, title: "Workforce Analytics", desc: "Analyze employee performance and data to make informed decisions and enhance workforce productivity and efficiency." }
        ].map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white py-12 w-full rounded-3xl shadow-lg mt-16"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">What Our Employees Say</h2>
          <p className="text-lg text-gray-600 mb-4">Here's what our employees have to say about working at JJM Manufacturing:</p>
        </div>
        <div className="flex justify-center gap-12">
          <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">"Working at JJM Manufacturing has been a fantastic experience. The company truly cares about its employees!"</p>
            <p className="text-gray-800 font-semibold mt-4">John Doe</p>
            <p className="text-gray-500">Production Manager</p>
          </div>
          <div className="w-1/3 bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">"The work environment at JJM is amazing! The company makes sure we have everything we need to succeed."</p>
            <p className="text-gray-800 font-semibold mt-4">Jane Smith</p>
            <p className="text-gray-500">HR Specialist</p>
          </div>
        </div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-gray-900 text-white py-6 w-full"
      >
        <div className="text-center">
          <p className="text-lg">© 2025 JJM Manufacturing. All rights reserved.</p>
          <div className="mt-4">
            <a href="#!" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a> | 
            <a href="#!" className="text-gray-400 hover:text-white transition duration-300"> Terms of Service</a>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Homepage;
