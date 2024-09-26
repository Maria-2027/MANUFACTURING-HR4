import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import connectDB from './config/db.js'; // Make sure to include the .js extension
import UserRouter from './routes/userRoute.js';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', UserRouter);

app.get("/", (req, res) => {
    res.send("Hello world ");
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
