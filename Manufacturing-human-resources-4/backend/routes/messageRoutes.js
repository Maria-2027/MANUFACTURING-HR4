import express from 'express';
import Message from '../models/Message.js';
const router = express.Router();

// Route for posting messages from employees
router.post('/api/messages', async (req, res) => {
    console.log(req.body); // Log the request body
  
    const { text, sender } = req.body;
    if (!text || !sender) {
      return res.status(400).json({ message: 'Text and sender are required.' });
    }
  
    try {
      const newMessage = new Message({ text, sender });
      await newMessage.save();
      res.status(201).json(newMessage); // Send back the saved message as JSON
    } catch (error) {
      res.status(400).json({ message: 'Error sending message', error: error.message });
    }
  });
  
export default router;
