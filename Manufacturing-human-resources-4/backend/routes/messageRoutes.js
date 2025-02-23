import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import authMiddleware from '../middleware/messageMiddleware.js';
const router = express.Router();

// Send message
router.post('/', authMiddleware, sendMessage);

// Get messages between users
router.get('/:userId', authMiddleware, getMessages);

export default router;
