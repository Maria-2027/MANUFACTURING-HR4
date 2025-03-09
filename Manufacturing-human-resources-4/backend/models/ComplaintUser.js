import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  ComplaintType: {
    type: String,
    required: true,
    enum: [
      'Salary issue',
      'Benefits issue',
      'Workplace Conflict',
      'Harassment',  // Fixed spelling
      'Unfair treatment'
    ]
  },
  ComplaintDescription: { type: String, required: true },
  File: { type: String },
  date: { type: Date, default: Date.now },
});

const ComplaintUser = mongoose.model('Complaint', complaintSchema);
export default ComplaintUser;
