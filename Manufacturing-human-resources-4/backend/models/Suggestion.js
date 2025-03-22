import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
  },
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'DECLINED'],
    default: 'PENDING'
  },
  approvedDate: {
    type: Date
  },
  isApproved: {
    type: Boolean,
    default: false
  }
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);
export default Suggestion;
