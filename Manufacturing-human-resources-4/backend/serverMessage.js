import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import socketIo from 'socket.io';

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

const server = app.listen(5000, () => {
  console.log('Server started on port 5000');
});

const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New WebSocket connection');
  socket.on('send_message', (message) => {
    io.emit('receive_message', message);
  });
});
