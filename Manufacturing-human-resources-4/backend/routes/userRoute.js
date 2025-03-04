import express from 'express';
import { signup } from '../controllers/user.controller.js';
import { login, getUserProfile } from '../controllers/userController.js';
import { submitComplaint } from '../controllers/complaintController.js';
import { authMiddleware } from './auth.js';
import multer from 'multer'; // For handling file uploads
import { generateServiceToken } from '../middleware/gatewayTokenGenerator.js';
import axios from 'axios'; // Added axios import
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';


// import User from '../models/User.js';

const router = express.Router();

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Existing routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile);
router.post('/EmComplaint', upload.single("File"), submitComplaint); // New route
router.post("/testLog", async (req, res) => {

  try {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    console.log("Login attempt for:", email); // Log incoming email

    // Generate a service token
    const serviceToken = generateServiceToken();
    console.log("Generated Service Token:", serviceToken); // Log generated token

    // Fetch users from the API Gateway
    const response = await axios.get(
      `${process.env.APP_API_URL}/admin/get-accounts`,
      {
        headers: { Authorization: `Bearer ${serviceToken}` },
      }
    );

    console.log("API Gateway Response:", response.data); // Log API Gateway response

    const users = response.data;

    if (!users || users.length === 0) {
      console.log("No users found in the API Gateway response.");
      return res.status(400).json({ message: "No users found" });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch); // Log password match status

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(res, user._id, user.role);
    console.log("Generated Token:", token); // Log generated token
    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("Error during login:", err.message); // Log error message
    return res.status(500).json({ message: "Server error" });
  }
});

const generateToken = (res, userId, role) => {
  // Use jsonwebtoken to create a token with user ID and role as payload
  const token = jwt.sign(
    { userId, role },
    process.env.SECRET_KEY, // Secret key for signing the token
    { expiresIn: '1h' } // Set expiration time for the token (1 hour in this case)
  );
  return token;
};




// router.get("/users", async (req, res) => {
//   try {
//     console.log("📡 Fetching users..."); // Debugging log

//     const users = await User.find();

//     if (!users || users.length === 0) {
//       console.log("❌ No users found in database.");
//       return res.status(404).json({ error: "No users found" });
//     }

//     console.log("✅ Users retrieved successfully:", users);
//     res.status(200).json(users);
//   } catch (error) {
//     console.error("❌ Error fetching users:", error);
//     res.status(500).json({ error: "Error fetching users", details: error.message });
//   }
// });

export default router;
