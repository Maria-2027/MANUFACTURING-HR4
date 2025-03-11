import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { motion } from "framer-motion";
import { SyncLoader } from "react-spinners";

const LoginChoice = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowText(true);
    }, 3000); // increased to 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center justify-center"
        >
          <div className="py-6 drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]">
            <SyncLoader
              cssOverride={{}}
              loading
              color="#000000"
              margin={12}
              size={15}
              speedMultiplier={0.5}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          duration: 1.2
        }}
        className="flex flex-col justify-center items-center w-full sm:w-1/2 p-8 space-y-8"
      >
        <div className="max-w-md w-full px-6">
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              duration: 1,
              delay: 0.4
            }}
            className="text-4xl sm:text-5xl font-bold text-center text-black mb-8"
          >
            Welcome Back
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center text-black mb-10"
          >
            Please select your role to continue
          </motion.p>

          <div className="space-y-6">
            <motion.button
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 200, damping: 15 }
              }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 20,
                duration: 1,
                delay: 0.6
              }}
              onClick={() => navigate("/login")}
              className="p-6 w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-xl 
                shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-all duration-300
                hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.4)] text-xl font-semibold
                flex items-center justify-center space-x-4 overflow-hidden relative
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                before:via-white before:to-transparent before:opacity-20 before:hover:translate-x-full
                before:transition-transform before:duration-700"
            >
              <UserIcon className="w-7 h-7" />
              <span>Login as Employee</span>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 200, damping: 15 }
              }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 50,
                damping: 20,
                duration: 1,
                delay: 0.8
              }}
              onClick={() => navigate("/admin")}
              className="p-6 w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl 
                shadow-[0_20px_50px_rgba(0,_0,_0,_0.5)] transition-all duration-300
                hover:shadow-[0_20px_50px_rgba(0,_0,_0,_0.3)] text-xl font-semibold
                flex items-center justify-center space-x-4 overflow-hidden relative
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent 
                before:via-white before:to-transparent before:opacity-20 before:hover:translate-x-full
                before:transition-transform before:duration-700"
            >
              <ShieldCheckIcon className="w-7 h-7" />
              <span>Login as Admin</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          duration: 1.2,
          delay: 0.6
        }}
        className="hidden sm:flex justify-center items-center w-1/2 bg-white p-10"
      >
        <div className="text-center">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.6
            }}
            className="text-5xl sm:text-6xl font-extrabold text-black mb-6 leading-tight"
          >
            JJM
            <br />
            MANUFACTURING
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-24 h-1 bg-black mx-auto mb-6 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 1
            }}
            className="mt-4 text-xl sm:text-2xl font-semibold text-black"
          >
            Basta Best Quality and Best Brand JJM na Yan!
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginChoice;
