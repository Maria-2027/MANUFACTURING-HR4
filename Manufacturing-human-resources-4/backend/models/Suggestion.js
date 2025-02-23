import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  fullName: {
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
});

const Suggestion = mongoose.model('Suggestion', suggestionSchema);
export default Suggestion;
