import express from 'express';
import Suggestion from '../models/Suggestion.js';

const router = express.Router();

// Route for submitting a suggestion
router.post('/employee-suggestions', async (req, res) => {
    const { fullName, suggestion, category } = req.body;
  
    if (!fullName || !suggestion || !category) {
      return res.status(400).json({ error: 'Full Name, Category, and Suggestion are required.' });
    }
  
    try {
      const newSuggestion = new Suggestion({ fullName, suggestion, category });
      await newSuggestion.save();
  
      // Log the saved suggestion
      console.log('New Suggestion saved:', newSuggestion);  // Log to the terminal
  
      res.status(200).json({ message: 'Suggestion submitted successfully.' });
    } catch (error) {
      console.log('Error saving suggestion:', error);  // Log the error if there is any
      res.status(500).json({ error: 'Error submitting suggestion.' });
    }
  });
  

// Route for fetching all suggestions
router.get('/employee-suggestions', async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ status: { $ne: 'DECLINED' } });
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching suggestions.' });
  }
});

router.put("/employee-suggestions/:id", async (req, res) => {
  const { id } = req.params;
  const { status, approvedDate, isApproved } = req.body;

  try {
    const suggestion = await Suggestion.findByIdAndUpdate(
      id,
      { 
        status,
        approvedDate,
        isApproved
      },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json(suggestion);
  } catch (error) {
    console.error("Error updating suggestion:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update the delete route
router.delete('/employee-suggestions/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const suggestion = await Suggestion.findByIdAndUpdate(
      id,
      { status: 'DECLINED' },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json({ message: "Suggestion declined successfully" });
  } catch (error) {
    console.error("Error declining suggestion:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
