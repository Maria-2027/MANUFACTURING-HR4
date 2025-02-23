import Message from '../models/Message.js';

// Send message
export const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const message = new Message({
      sender: req.userId,
      receiver: receiverId,
      content,
    });

    await message.save();
    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get all messages between users
export const getMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    }).populate('sender receiver', 'username');

    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
