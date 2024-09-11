import express from 'express';
import { getUser } from '../controllers/userController';

const userRouter = express.Router();

userRouter.get("/getAllUsers",getUser);
// userRouter.post("/register",registerUser);
// userRouter.post("/login",loginUser);

export default userRouter;
