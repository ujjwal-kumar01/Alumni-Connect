// models/globalChat.model.js
import mongoose from 'mongoose';

const globalChatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const GlobalChat = mongoose.model('GlobalChat', globalChatSchema);
