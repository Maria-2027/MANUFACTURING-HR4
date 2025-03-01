import express from 'express';
import { signup } from '../controllers/user.controller.js';
import { login, getUserProfile } from '../controllers/userController.js';
import { submitComplaint } from '../controllers/complaintController.js';
import { authMiddleware } from './auth.js';
import multer from 'multer'; // For handling file uploads
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

    const serviceToken = generateServiceToken();

    // Fetch users from API Gateway
    const response = await axios.get(
      `${process.env.API_GATEWAY_URL}/admin/get-accounts`,
      {
        headers: { Authorization: `Bearer ${serviceToken}` },
      }
    );

    const users = response.data;
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate and send JWT token
    const token = generateTokenAndSetCookie(res, user._id, user.role);
    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("Error during login:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});
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
