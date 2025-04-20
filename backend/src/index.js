import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { DB_NAME } from './constants.js';
import connecting_db from './db/index.js';
import { app } from './app.js';
import { Server } from 'socket.io';
import http from 'http';
import { User } from './models/user.model.js';
import { GlobalChat } from './models/globalChat.model.js'; // ✅ Import GlobalChat model

dotenv.config({ path: './env' });

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

export { io };

// Handle socket connections
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId?.toString();

  if (userId) {
    socket.join(userId);
    io.emit('userOnline', userId);

    socket.on('disconnect', async () => {
      try {
        await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
        io.emit('userOffline', userId);
      } catch (err) {
        console.error('Error updating lastSeen:', err.message);
      }
    });

    // 📩 Personal chat
    socket.on('sendMessage', (message) => {
      io.to(message.receiverId).emit('receiveMessage', message);
      io.to(message.receiverId).emit('newNotification', message);
    });

    // ✍️ Typing indicators
    socket.on('typing', ({ senderId, receiverId }) => {
      io.to(receiverId).emit('userTyping', { senderId });
    });

    socket.on('stopTyping', ({ senderId, receiverId }) => {
      io.to(receiverId).emit('userStoppedTyping', { senderId });
    });
  }

  // 🌐 Global Chat
  socket.on('join-global-chat', () => {
    socket.join('global-room');
    console.log(`User ${userId || socket.id} joined global chat`);
  });

  socket.on('global-message', async (messageData) => {
    try {
      // ✅ Save message to DB
      const newMessage = new GlobalChat({
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        message: messageData.message,
        timestamp: new Date(),
      });
      await newMessage.save();

      // ✅ Broadcast to all in global-room
      io.to('global-room').emit('receive-global-message', newMessage);
    } catch (err) {
      console.error('Error saving global message:', err.message);
    }
  });
});

// Connect DB & start server
connecting_db()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log('✅ Server is running on port:', process.env.PORT || 8000);
    });
  })
  .catch((error) => {
    console.error('❌ Error connecting to DB:', error.message);
  });
