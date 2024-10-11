const mongoose = require('mongoose');

// Complaint Schema
const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  complaint: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Complaint', complaintSchema);
