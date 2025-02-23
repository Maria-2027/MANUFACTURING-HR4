// this file is backend/controllers/complaintController.js

import ComplaintUser from "../models/Complaint.js";

export const submitComplaint = async (req, res) => {
  try {
    const { FullName, ComplaintDescription } = req.body;
    const file = req.file ? req.file.path : null; // Get uploaded file path

    const newComplaint = new ComplaintUser({
      FullName,
      ComplaintDescription,
      File: file,
    });

    const savedComplaint = await newComplaint.save();
    console.log("✅ Complaint saved:", savedComplaint); // Log to check if saved

    res.status(201).json({ message: "Complaint submitted successfully!", complaint: savedComplaint });
  } catch (error) {
    console.error("❌ Error saving complaint:", error); // Log errors
    res.status(500).json({ error: "Server error, could not submit complaint.", details: error.message });
  }
};
