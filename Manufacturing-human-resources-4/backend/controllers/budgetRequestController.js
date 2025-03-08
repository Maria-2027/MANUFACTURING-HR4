import { generateServiceToken } from "../middleware/gatewayTokenGenerator.js";
import axios from 'axios';
import BudgetRequest from "../models/BudgetRequestModel.js";
import expressAsyncHandler from "express-async-handler";

// Create a new Budget Request
export const requestBudget = expressAsyncHandler(
  async (req, res) => {
    console.log("Received Data:", req.body); // ADD THIS LINE
    const { totalBudget, category, reason, documents } = req.body;
    console.log({
      totalBudget,
      category,
      reason,
      documents,
    });

    console.log("Received category:", category); 

    // Set department to HR4 by default
    const department = "HR4";

    // Ensure category is 'Operational Expenses' for HR4
    if (category !== "Operational Expenses") {
      return res.status(400).json({ message: "HR4 must use category: 'Operational Expenses'." });
    }

    const budgetAmount = Number(totalBudget);
    if (isNaN(budgetAmount)) {
      return res.status(400).json({ message: "totalBudget must be a number." });
    }

    const newRequest = new BudgetRequest({
      department,
      status: "Pending",
      totalBudget: budgetAmount,
      category,
      reason,
      documents,
    });

    try {
      const savedRequest = await newRequest.save();
      const data = {
        approvalId: savedRequest._id,
        department: savedRequest.department,
        status: savedRequest.status,
        totalBudget: savedRequest.totalBudget,
        category: savedRequest.category,
        reason: savedRequest.reason,
        documents: savedRequest.documents,
        comment: savedRequest.comment,
      };
      console.log("Data to send to finance:", data);

      const token = generateServiceToken();
      console.log("Generated Token:", token);

      const sendRequest = await axios.post(`https://gateway.jjm-manufacturing.com/finance/budget-request`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Finance Response:", sendRequest.data);
      res.status(200).json({ message: "Budget request sent to Finance", data });
    } catch (error) {
      console.error("Error during budget request creation:", error.response ? error.response.data : error.message);
      res.status(500).json({ message: "Error during budget request creation", error: error.message });
    }
  }
);

// export const updateBudgetRequest = async (req, res) => {
//   try {
//       const { approvalId, status, comment } = req.body;
//       console.log("Received Update Data:", req.body);

//       if (!approvalId || !status) {
//           return res.status(400).json({ message: "Approval ID and status are required." });
//       }

//       let existingRequest = await BudgetRequest.findById(approvalId);

//       if (!existingRequest) {
//           return res.status(404).json({ message: "Budget request not found." });
//       }

//       // Update fields
//       existingRequest.status = status;
//       if (comment) {
//           existingRequest.comment = comment;
//       }

//       const updatedRequest = await existingRequest.save();

//       console.log("Updated Budget Request:", updatedRequest);

//       res.status(200).json({ message: "Budget request updated successfully", updatedRequest });

//   } catch (error) {
//       console.error("Error updating budget request:", error);
//       res.status(500).json({ message: "Error updating budget request", error: error.message });
//   }
// };

export const updateBudgetRequest = expressAsyncHandler(async (req, res) => {
  try {
    // Log received request data
    console.log("Received Finance Update Data:", req.body);

    // Extract required fields
    const { approvalId, status, comment } = req.body;

    // Validate input
    if (!approvalId || !status) {
      return res.status(400).json({ message: "Approval ID and status are required." });
    }

    // Find the existing budget request
    const existingRequest = await BudgetRequest.findById(approvalId);

    if (!existingRequest) {
      return res.status(404).json({ message: "Budget request not found." });
    }

    // Update the fields
    existingRequest.status = status;
    if (comment) {
      existingRequest.comment = comment;
    }

    // Save the updated request
    const updatedRequest = await existingRequest.save();
    
    console.log("✅ Budget Request Updated:", updatedRequest);

    // Send success response
    res.status(200).json({ 
      message: "Budget request updated successfully", 
      data: updatedRequest 
    });

  } catch (error) {
    console.error("❌ Error updating budget request:", error);
    res.status(500).json({ 
      message: "Error updating budget request", 
      error: error.message 
    });
  }
});

export const getAllBudgetRequests = expressAsyncHandler(async (req, res) => {
  try {
    const budgetRequests = await BudgetRequest.find();
    res.status(200).json({ success: true, data: budgetRequests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching budget requests", error: error.message });
  }
});