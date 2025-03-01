import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import suggestionRoute from './routes/suggestionRoute.js';
import ComplaintUser from "./models/ComplaintUser.js";
import Suggestion from "./models/Suggestion.js";
import multer from "multer";  // Import multer for file handling
import path from "path";  // For handling file paths
import Complaint from "./routes/Complaint.js";
import budgetRequestRoutes from './routes/budgetRequests.js';

dotenv.config();
const app = express();

// ✅ Middleware should be declared before defining routes
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // Ensure JSON parsing

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
  },
});

const upload = multer({ storage: storage }); // Initialize multer with storage settings

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/auth", suggestionRoute);
app.use("/api", Complaint);
app.use('/api/budget-requests', budgetRequestRoutes);

app.get("/api/auth",  (req, res) => {
  Suggestion.find()
  .then((suggest) => res.json(suggest))
  .catch((err) => res.json(err));
  });

app.get("/EmComplaint", (req, res) => {
  ComplaintUser.find()
    .then((complaints) => res.json(complaints))
    .catch((err) => res.json(err));
});


// Start server
const PORT = process.env.PORT || 7688;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on PORT: ${PORT}`);
});
