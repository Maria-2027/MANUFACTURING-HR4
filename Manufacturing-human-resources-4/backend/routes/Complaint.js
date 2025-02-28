const express = require('express');//ito 
const Complaint = require('../models/Complaint');
// ito dapat import express from express kasi ung node modules mo naka models
const router = express.Router();

// POST: Create a new complaint
router.post('/EmComplaint', async (req, res) => {
  try {
    const { name, email, complaint } = req.body;
    const newComplaint = new Complaint({ name, email, complaint });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json({ error: 'Error saving complaint' });
  }
});

// GET: Get all complaints
router.get('/EmComplaint', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching complaints' });
  }
});

module.exports = router;
