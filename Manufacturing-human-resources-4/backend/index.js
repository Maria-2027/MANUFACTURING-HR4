import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import User from "./models/User.js"; // Import User model
import suggestionRoute from './routes/suggestionRoute.js';
import ComplaintUser from "./models/Complaint.js";

dotenv.config();

const app = express();

// ✅ Middleware should be declared before defining routes
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cors());
app.use(cookieParser());
app.use(express.json()); // Ensure JSON parsing


app.use("/api/auth", userRoutes);
app.use("/api/auth", suggestionRoute);
app.get("/EmComplaint", (req, res) => {
    ComplaintUser.find()
    .then((complaints) => res.json(complaints))
    .catch((err) => res.json(err))
}) 

const PORT = process.env.PORT || 7688;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on PORT: ${PORT}`);
});