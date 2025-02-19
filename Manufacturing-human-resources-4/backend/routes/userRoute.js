import express from 'express';
import { signup } from '../controllers/user.controller.js';
import { login, getUserProfile } from '../controllers/userController.js';
import {authMiddleware} from './auth.js';


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getUserProfile); // 🔒 Protected Route


export default router;
