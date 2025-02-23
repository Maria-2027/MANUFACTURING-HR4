import express from 'express';
import Suggestion from '../models/Suggestion.js';

const router = express.Router();

// Route for submitting a suggestion
router.post('/employee-suggestions', async (req, res) => {
    const { fullName, suggestion } = req.body;
  
    if (!fullName || !suggestion) {
      return res.status(400).json({ error: 'Full Name and Suggestion are required.' });
    }
  
    try {
      const newSuggestion = new Suggestion({ fullName, suggestion });
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
    const suggestions = await Suggestion.find();
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching suggestions.' });
  }
});

export default router;
