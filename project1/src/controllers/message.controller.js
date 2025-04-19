import mongoose from 'mongoose';
import { Message } from '../models/message.model.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      read: false
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    if (!userId1 || !userId2) {
      return res.status(400).json({ success: false, message: 'Missing user IDs' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark messages from sender as read by receiver
export const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ success: false, message: 'Missing sender or receiver ID' });
    }

    const result = await Message.updateMany(
      {
        senderId,
        receiverId,
        read: false
      },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true, updatedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unread message count per sender for a user
export const getUnreadMessageCount = async (req, res) => {
  console.log("hello")
  try {
    const { userId } = req.params;
    console.log("Fetching unread counts for:", userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing userId' });
    }

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(userId),
          read: false
        }
      },
      {
        $group: {
          _id: '$senderId',
          count: { $sum: 1 }
        }
      }
    ]);

    const formatted = {};
    unreadCounts.forEach((item) => {
      formatted[item._id] = item.count;
    });

    res.status(200).json({ success: true, unreadCounts: formatted });
  } catch (error) {
    console.error("Unread count error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
