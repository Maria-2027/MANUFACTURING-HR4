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

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['Pending', 'In-Review', 'Resolved', 'Escalated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const updatedComplaint = await ComplaintUser.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    console.log("✅ Complaint status updated:", updatedComplaint);
    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint: updatedComplaint
    });

  } catch (error) {
    console.error("❌ Error updating complaint status:", error);
    res.status(500).json({
      success: false,
      message: 'Error updating complaint status',
      error: error.message
    });
  }
};
