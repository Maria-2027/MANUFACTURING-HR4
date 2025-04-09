// this file is backend/controllers/complaintController.js

import ComplaintUser from "../models/ComplaintUser.js";

export const submitComplaint = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body for debugging
    const { firstName, lastName, ComplaintType, ComplaintDescription, complaintAgainst, complaintAgainstPosition, complaintAgainstDepartment } = req.body;
    const { File } = req.body; // Get file URL from frontend
    const file = File || null; // Use it in the complaint

    const newComplaint = new ComplaintUser({
      firstName,
      lastName,
      ComplaintType,
      ComplaintDescription,
      complaintAgainst,
      complaintAgainstPosition,
      complaintAgainstDepartment,
      File: file, // Dapat tama ang source ng file
    });

    const savedComplaint = await newComplaint.save();
    console.log("✅ Complaint saved:", savedComplaint); // Log to check if saved

    res.status(201).json({ message: "Complaint submitted successfully!", complaint: savedComplaint });
  } catch (error) {
    console.error("❌ Error saving complaint:", error); // Log errors
    res.status(500).json({ error: "Server error, could not submit complaint.", details: error.message });
  }
};
