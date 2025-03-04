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
import messageRoutes from './routes/messageRoutes.js';
import cloudinary from "cloudinary";
import budgetRequestRoute from "./routes/budgetRequests.js";
dotenv.config();
const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ✅ Middleware should be declared before defining routes
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // Ensure JSON parsing

// Set up multer storage configuration
const storage = multer.memoryStorage(); // Save files in memory
const upload = multer({ storage: storage });

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Upload failed!" });
        }
        res.status(200).json({ url: result.secure_url });
      }
    );

    req.file.stream.pipe(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading to Cloudinary" });
  }
});


// Routes
app.use("/api/auth", userRoutes);
app.use("/api/auth", suggestionRoute);
app.use("/api", Complaint);
app.use('/api/budget-requests', budgetRequestRoute);
app.use(messageRoutes);

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
