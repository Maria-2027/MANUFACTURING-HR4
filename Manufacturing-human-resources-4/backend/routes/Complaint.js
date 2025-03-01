import express from 'express';  // Import express using ES module syntax
import ComplaintUser from '../models/ComplaintUser.js';  // Import the Complaint model (add .js for ES Modules)

const router = express.Router();

// POST: Create a new complaint
router.post('/EmComplaint', async (req, res) => {
  try {
    const { FullName, ComplaintDescription, File } = req.body;

    // Gumawa ng bagong complaint gamit ang tamang field names
    const newComplaint = new ComplaintUser({
      FullName,
      ComplaintDescription,
      File: File || "", // Optional file field
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint submitted successfully!", complaint: newComplaint });
  } catch (err) {
    console.error("❌ Error saving complaint:", err);
    res.status(500).json({ error: "Server error, could not submit complaint.", details: err.message });
  }
});

// GET: Get all complaints
router.get('/EmComplaint', async (req, res) => {
  try {
    const complaints = await ComplaintUser.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching complaints' });
  }
});

// Export the router for use in other files
export default router;  // Use export default for ES module compatibility
