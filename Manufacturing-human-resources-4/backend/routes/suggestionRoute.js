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
  const { status, feedback, employeeId, updatedAt } = req.body;

  try {
    const suggestion = await Suggestion.findByIdAndUpdate(
      id,
      { 
        status,
        feedback,
        employeeId,
        updatedAt,
        actionDate: new Date()
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

// Change from delete to put route for declining suggestions
router.put('/employee-suggestions/decline/:id', async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;
  
  try {
    const suggestion = await Suggestion.findByIdAndUpdate(
      id,
      { 
        status: 'DECLINED',
        feedback: feedback
      },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json({ message: "Suggestion declined successfully", suggestion });
  } catch (error) {
    console.error("Error declining suggestion:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add new admin feedback route
router.post('/adminfeedback', async (req, res) => {
  const { suggestionId, status, feedback, employeeId } = req.body;
  console.log('Received POST request with:', { suggestionId, status, feedback, employeeId }); // Debug log

  if (!suggestionId || !status || !feedback) {
    return res.status(400).json({ error: 'Suggestion ID, status, and feedback are required.' });
  }

  try {
    const suggestion = await Suggestion.findByIdAndUpdate(
      suggestionId,
      {
        status,
        feedback,
        employeeId,
        updatedAt: new Date(),
        actionDate: new Date(),
        adminResponded: true
      },
      { new: true }
    );
    console.log('Updated suggestion:', suggestion); // Debug log
    
    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json({
      message: "Feedback submitted successfully",
      suggestion
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error while submitting feedback" });
  }
});

// Get all admin feedback
router.get('/adminfeedback', async (req, res) => {
  try {
    console.log('Fetching admin feedback...');
    const suggestions = await Suggestion.find({
      $or: [
        { status: 'APPROVED' },
        { status: 'DECLINED' },
        { feedback: { $exists: true, $ne: null } }
      ]
    }).select('_id fullName category suggestion status feedback dateSubmitted');
    
    console.log('Found feedback count:', suggestions.length);
    console.log('Found feedback data:', JSON.stringify(suggestions, null, 2));

    res.status(200).json(suggestions);
    
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error while fetching feedback" });
  }
});

export default router;
