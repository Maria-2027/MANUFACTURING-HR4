import express from 'express';
import { signup } from '../controllers/user.controller.js';
import { login, getUserProfile } from '../controllers/userController.js';
import { submitComplaint } from '../controllers/complaintController.js';
import { authMiddleware } from './auth.js';
import multer from 'multer'; // For handling file uploads

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

export default router;
