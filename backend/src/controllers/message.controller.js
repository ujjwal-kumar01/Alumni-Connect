import mongoose from 'mongoose';
import { Message } from '../models/message.model.js';
import { User } from '../models/user.model.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Create a new message object
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      timestamp: new Date(),
      read: false, // Initially, the message is unread
    });

    // Save the message to the database
    await newMessage.save();

    // Update the sender's lastSeen timestamp to current time
    await User.findByIdAndUpdate(senderId, { lastSeen: new Date() });

    // Optionally update receiver's lastSeen as well
    await User.findByIdAndUpdate(receiverId, { lastSeen: new Date() });

    // Return the new message in the response
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

    // Get the timestamp of the last message (this will be used for lastSeen)
    const lastMessage = messages[messages.length - 1];
    const lastSeen = lastMessage ? lastMessage.timestamp : null;

    res.status(200).json({ success: true, messages, lastSeen });
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

    const now = new Date();

    // Update read status and seenAt timestamp for all unread messages
    const result = await Message.updateMany(
      {
        senderId,
        receiverId,
        read: false
      },
      { $set: { read: true, seenAt: now } }  // mark as read + seenAt timestamp
    );

    // Optionally update the receiver's lastSeen timestamp when they read the message
    await User.findByIdAndUpdate(receiverId, { lastSeen: now });

    res.status(200).json({ success: true, updatedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unread message count per sender for a user
export const getUnreadMessageCount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing userId' });
    }

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          receiverId: mongoose.Types.ObjectId.createFromHexString(userId),
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChatList = async (req, res) => {
  const { userId } = req.query;

  try {
    // const currentUserId = new mongoose.Types.ObjectId(userId); // ✅ Use `new` keyword
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }
    const currentUserId = new mongoose.Types.ObjectId(userId);
    
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: currentUserId },
            { receiverId: currentUserId }
          ]
        }
      },
      {
        $addFields: {
          otherUserId: {
            $cond: [
              { $eq: ['$senderId', currentUserId] },
              '$receiverId',
              '$senderId'
            ]
          }
        }
      },
      {
        $sort: { createdAt: -1 } // Sort to get the latest message per user
      },
      {
        $group: {
          _id: '$otherUserId',
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: false // make sure nulls are excluded
        }
      },
      
      {
        $project: {
          receiverId: '$_id',
          fullName: '$user.fullName',
          avatar: '$user.avatar',
          lastMessage: 1,
          lastMessageTime: 1
        }
      },
      {
        $sort: { lastMessageTime: -1 }
      }
    ]);

    res.status(200).json({ chatList: messages });
  } catch (error) {
    console.error('Error fetching chat list:', error);
    res.status(500).json({ error: 'Failed to fetch chat list' });
  }
};