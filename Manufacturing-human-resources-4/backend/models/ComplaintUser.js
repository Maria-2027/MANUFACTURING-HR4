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
  complaintAgainst: { type: String, required: true },
  complaintAgainstPosition: { type: String, required: true },
  complaintAgainstDepartment: { type: String, required: true },
  File: { type: String },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In-Review', 'Resolved', 'Escalated'],
    default: 'Pending'
  }
});

const ComplaintUser = mongoose.model('Complaint', complaintSchema);
export default ComplaintUser;
