import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for referencing user
    ref: 'User',  // Reference to User collection
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for referencing user
    ref: 'User',  // Reference to User collection
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
