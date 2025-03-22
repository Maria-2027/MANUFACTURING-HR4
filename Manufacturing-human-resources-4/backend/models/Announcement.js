import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of user IDs who liked
  comments: [{
    userId: String,
    userName: String,
    text: String,
    timestamp: Date
  }]
});

export default mongoose.model('Announcement', announcementSchema);
