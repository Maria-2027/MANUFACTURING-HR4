import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from "./config/db.js";

import authRoute from './routes/authRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoute);
app.listen(PORT,() => {
    connectDB();
    console.log(`Server is running PORT: ${PORT}`);
});
