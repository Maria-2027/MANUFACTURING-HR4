import mongoose from 'mongoose';

const budgetRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending'], required: true },
  category: { type: String, required: true }, // Adjust this validation based on your business logic
  documents: { type: String, match: /https?:\/\/.*\.pdf/, required: false }, // Validate PDF URL
});

const BudgetRequest = mongoose.model('BudgetRequest', budgetRequestSchema);

export default BudgetRequest;
