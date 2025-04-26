import React, { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const socket = io('http://localhost:8000');

const Chat = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(false);
  const [receiverData, setReceiverData] = useState(null);
  const [lastSeen, setLastSeen] = useState('');

  const chatContainerRef = useRef(null);

  // 👉 markAsRead defined with useCallback so it's not stale
  const markAsRead = useCallback(async (senderId, receiverId, messageId) => {
    console.log("Reading message started");
    try {
      await axios.post('http://localhost:8000/api/v1/message/mark-read', {
        senderId,
        receiverId
      });
      setChat((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);

    if (loggedInUser && receiverId) {
      fetchMessages(loggedInUser._id, receiverId);
      fetchReceiver(receiverId);
      socket.emit('userOnline', loggedInUser._id);
    }

    socket.on('receiveMessage', async (msgData) => {
      if (!loggedInUser) return;
      
      console.log("Socket received message:", msgData);
      console.log("loggedInUser? ", loggedInUser);
      console.log("Checking match:", msgData.receiverId, loggedInUser?._id);
      
      const isRelevant =
        (msgData.senderId === loggedInUser._id && msgData.receiverId === receiverId) ||
        (msgData.senderId === receiverId && msgData.receiverId === loggedInUser._id);

      if (isRelevant) {
        setChat((prev) => {
          const alreadyExists = prev.some((msg) => msg._id === msgData._id);
          return alreadyExists ? prev : [...prev, msgData];
        });

        if (msgData.receiverId === loggedInUser._id) {
          await markAsRead(msgData.senderId, loggedInUser._id, msgData._id);
          socket.emit('messageRead', { messageId: msgData._id });
        }
      }
    });

    socket.on('userTyping', ({ senderId }) => {
      if (senderId === receiverId) setTypingUser(true);
    });

    socket.on('userStoppedTyping', ({ senderId }) => {
      if (senderId === receiverId) setTypingUser(false);
    });

    socket.on('messageDelivered', ({ messageId }) => {
      setChat((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, delivered: true } : msg
        )
      );
    });

    socket.on('messageRead', ({ messageId }) => {
      setChat((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    });

    socket.on('userOffline', (userId) => {
      if (userId === receiverId) fetchReceiver(receiverId);
    });

    socket.on('userOnline', (userId) => {
      if (userId === receiverId) fetchReceiver(receiverId);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
      socket.off('messageDelivered');
      socket.off('messageRead');
      socket.off('userOffline');
      socket.off('userOnline');
    };
  }, [receiverId, markAsRead]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchReceiver(receiverId);
    }, 60000);
    return () => clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const fetchMessages = async (userId1, userId2) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/message/${userId1}/${userId2}`);
      setChat(res.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchReceiver = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/${id}`);
      setReceiverData(res.data.user);
      setLastSeen(res.data.user.lastSeen);
    } catch (error) {
      console.error("Error fetching receiver:", error);
    }
  };

  const handleTyping = () => {
    if (!isTyping && user) {
      setIsTyping(true);
      socket.emit("typing", { senderId: user._id, receiverId });
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("stopTyping", { senderId: user._id, receiverId });
      }, 2000);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user || !receiverId) return;

    const msgData = {
      senderId: user._id,
      receiverId,
      content: message,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post('http://localhost:8000/api/v1/message/send', msgData);
      const savedMessage = response.data.message;

      setChat((prev) => [...prev, savedMessage]);
      socket.emit('sendMessage', savedMessage);
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {receiverData && (
        <div
          className="flex items-center gap-4 mb-4 cursor-pointer"
          onClick={() => navigate(`/profile/${receiverData._id}`)}
        >
          <img
            src={receiverData.avatar || "/default-profile.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <h2 className="font-semibold text-lg text-gray-800">{receiverData.fullName}</h2>
            <span className="text-xs text-gray-500">
              {lastSeen && dayjs().diff(lastSeen, 'minute') < 1
                ? "Online"
                : `Last seen: ${dayjs(lastSeen).fromNow()}`}
            </span>
          </div>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="h-[325px] overflow-y-auto bg-gray-100 rounded-lg p-4"
      >
        {chat.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.senderId === user?._id ? 'text-right' : 'text-left'}`}>
            <div className="inline-block px-3 py-2 rounded bg-blue-200 text-gray-900">
              {msg.content}
              {msg.senderId === user?._id && (
                <span className="text-xs ml-2">
                  {msg.read ? '✓✓' : msg.delivered ? '✓' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
        {typingUser && <p className="text-sm text-gray-500 italic">Typing...</p>}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-l px-3 py-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
