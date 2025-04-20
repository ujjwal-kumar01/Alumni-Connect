// controllers/globalChat.controller.js
import { GlobalChat } from '../models/globalChat.model.js'; // ✅ correct model import

// ✅ Get all global messages
export const getAllGlobalMessages = async (req, res) => {
  try {
    const messages = await GlobalChat.find().sort({ timestamp: 1 }); // oldest to newest
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching global messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Post a new global message
export const postGlobalMessage = async (req, res) => {
  const { senderId, senderName, message } = req.body;

  if (!senderId || !senderName || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newMessage = new GlobalChat({ senderId, senderName, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error saving global message:', err);
    res.status(500).json({ error: 'Could not save message' });
  }
};
