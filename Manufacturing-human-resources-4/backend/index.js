import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoute.js";
import User from "./models/User.js"; // Import User model

dotenv.config();

const app = express();

// ✅ Middleware should be declared before defining routes
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json()); // Ensure JSON parsing

// ✅ Fix Login Route
// app.post("/api/auth/login", async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         // ✅ Check if user exists
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ message: "No Record Existed" });
//         }

//         // ✅ Compare password using bcrypt
//         const isPasswordMatch = await bcrypt.compare(password, user.password);
//         if (!isPasswordMatch) {
//             return res.status(400).json({ message: "The Password is incorrect" });
//         }

//         res.json({ message: "Success" }); // Send success message
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// ✅ Use userRoutes for authentication endpoints
app.use("/api/auth", userRoutes);

const PORT = process.env.PORT || 7688;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on PORT: ${PORT}`);
});