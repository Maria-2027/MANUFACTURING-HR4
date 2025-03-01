// controllers/budgetRequestController.js
import BudgetRequest from '../models/BudgetRequest.js';

// Create a new Budget Request
export const createBudgetRequest = async (req, res) => {
  const { approvalId, department, totalBudget, category, reason, documents } = req.body;
  try {
    const newRequest = new BudgetRequest({
      approvalId,
      department,
      totalBudget,
      category,
      reason,
      documents,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Budget Requests
export const getAllBudgetRequests = async (req, res) => {
  try {
    const budgetRequests = await BudgetRequest.find();
    res.status(200).json(budgetRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
