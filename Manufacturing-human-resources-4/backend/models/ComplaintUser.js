import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  ComplaintDescription: { type: String, required: true },
  File: { type: String }, // Allow files to be optional
  date: { type: Date, default: Date.now },
});

const ComplaintUser = mongoose.model('Complaint', complaintSchema);
export default ComplaintUser;
