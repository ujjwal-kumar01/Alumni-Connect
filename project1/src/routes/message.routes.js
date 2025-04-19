import express from 'express';
import {
  sendMessage,
  getMessages,
  markMessagesAsRead,
  getUnreadMessageCount
} from '../controllers/message.controller.js';

const router = express.Router();

// Send a new private message
router.post('/send', sendMessage);

// Get all messages between two users
router.get('/:userId1/:userId2', getMessages);

// Mark messages as read (used for read receipts)
router.post('/mark-read', markMessagesAsRead);

// Get unread message counts for a user
router.get('/unread/:userId', getUnreadMessageCount);

export default router;
