import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";             // Fixed path
import userRoutes from "./routes/userRoute.js";         // Fixed path
import suggestionRoute from './routes/suggestionRoute.js'; // Fixed path
import ComplaintUser from "./models/ComplaintUser.js";  // Fixed path
import Suggestion from "./models/Suggestion.js";        // Fixed path
import multer from "multer";  // Import multer for file handling
import path from "path";  // For handling file paths
import Complaint from "./routes/Complaint.js";          // Fixed path
import messageRoutes from './routes/messageRoutes.js';  // Fixed path
import cloudinary from "cloudinary";
import budgetRequestRoute from "./routes/budgetRequests.js"; // Fixed path
import integrationRoutes from "./routes/integrationRoutes.js"; // Fixed path

dotenv.config();
const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ✅ Middleware should be declared before defining routes
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "https://hr4.jjm-manufacturing.com"],
  credentials: true,
  methods: ["GET", "POST","PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.urlencoded({ extended: true })); // Ensure JSON parsing

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

app.get("/EmComplaint", async (req, res) => {
  ComplaintUser.find()
    .then((complaints) => res.json(complaints))
    .catch((err) => res.json(err));
});


app.use("/api/integration", integrationRoutes);


// Start server
const PORT = process.env.PORT || 7688;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on PORT: ${PORT}`);
});
