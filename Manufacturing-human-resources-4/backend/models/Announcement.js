import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    text: String,
    timestamp: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Announcement', announcementSchema);
