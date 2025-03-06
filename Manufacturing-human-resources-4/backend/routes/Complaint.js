import express from 'express'; 
import { submitComplaint } from '../controllers/complaintController.js'; // Import the submitComplaint function from the controller
import verifyToken from '../middleware/messageMiddleware.js'; 

const router = express.Router();

// POST: Create a new complaint using the controller
router.post('/api/EmComplaint', verifyToken, submitComplaint); // Use the controller function

// GET: Get all complaints
router.get('/EmComplaint', verifyToken, async (req, res) => {
  try {
    const complaints = await ComplaintUser.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching complaints' });
  }
});

// Export the router for use in other files
export default router;
