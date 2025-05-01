import React, { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { ChevronLeft, ChevronRight } from 'lucide-react';

dayjs.extend(relativeTime);

const Chat = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState(null);
  const [typingUser, setTypingUser] = useState(false);
  const [receiverData, setReceiverData] = useState(null);
  const [lastSeen, setLastSeen] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);

  const markAsRead = useCallback(async (senderId, receiverId, ids) => {
    try {
      await axios.post('http://localhost:8000/api/v1/message/mark-read', { senderId, receiverId });
      setChat(prev => prev.map(msg => ids.includes(msg._id) ? { ...msg, read: true } : msg));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, []);

  const fetchMessages = async (userId1, userId2) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/message/${userId1}/${userId2}`);
      const messages = res.data.messages;
      setChat(messages);

      const unread = messages.filter(msg => msg.receiverId === userId1 && !msg.read);
      if (unread.length) {
        const ids = unread.map(m => m._id);
        await markAsRead(userId2, userId1, ids);
        ids.forEach(id => socketRef.current.emit('messageRead', { messageId: id }));
      }

      const seenMsgs = messages.filter(msg => msg.seenAt !== null);
      if (seenMsgs.length) {
        setLastSeen(seenMsgs[seenMsgs.length - 1].seenAt);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const fetchReceiver = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/${id}`);
      setReceiverData(res.data.user);
    } catch (err) {
      console.error('Receiver fetch error:', err);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    const socket = io('http://localhost:8000');
    socketRef.current = socket;

    if (storedUser) {
      socket.emit('userOnline', storedUser._id);
    }

    socket.on('receiveMessage', async msg => {
      if ((msg.senderId === storedUser._id && msg.receiverId === receiverId) ||
          (msg.senderId === receiverId && msg.receiverId === storedUser._id)) {
        setChat(prev => prev.some(m => m._id === msg._id) ? prev : [...prev, msg]);

        if (msg.receiverId === storedUser._id) {
          await markAsRead(msg.senderId, storedUser._id, [msg._id]);
          socket.emit('messageRead', { messageId: msg._id });
        }
      }
    });

    socket.on('userTyping', ({ senderId }) => {
      if (senderId === receiverId) setTypingUser(true);
    });
    socket.on('userStoppedTyping', ({ senderId }) => {
      if (senderId === receiverId) setTypingUser(false);
    });

    socket.on('messageRead', ({ messageId }) => {
      setChat(prev => prev.map(m => m._id === messageId ? { ...m, read: true } : m));
    });

    socket.on('userOnline', id => id === receiverId && setIsOnline(true));
    socket.on('userOffline', id => {
      if (id === receiverId) {
        setIsOnline(false);
        fetchReceiver(receiverId);
      }
    });

    return () => socket.disconnect();
  }, [receiverId, markAsRead]);

  useEffect(() => {
    if (user && receiverId) {
      fetchMessages(user._id, receiverId);
      fetchReceiver(receiverId);
    }
  }, [user, receiverId]);

  useEffect(() => {
    if (!user?._id) return;
    const fetchChatList = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/message/chat-list', {
          params: { userId: user._id },
        });
        setChatList(res.data.chatList);
      } catch (error) {
        console.error('Error fetching chat list:', error);
      }
    };
    fetchChatList();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => receiverId && fetchReceiver(receiverId), 60000);
    return () => clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat, receiverId]);

  const handleTyping = () => {
    if (user) {
      socketRef.current.emit('typing', { senderId: user._id, receiverId });
      setTimeout(() => socketRef.current.emit('stopTyping', { senderId: user._id, receiverId }), 2000);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const msg = {
      senderId: user._id,
      receiverId,
      content: message,
      timestamp: new Date().toISOString(),
    };

    try {
      const { data } = await axios.post('http://localhost:8000/api/v1/message/send', msg);
      setChat(prev => [...prev, data.message]);
      socketRef.current.emit('sendMessage', data.message);
      setMessage('');
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const handleKeyDown = e => e.key === 'Enter' && sendMessage();

  return (
    <div className="flex h-[90vh] bg-gray-50 text-gray-800 p-4 gap-4 ">
      {isSidebarOpen && (
        <div className="w-[30%] bg-gray-900 text-white flex flex-col rounded-xl shadow-lg relative h-[85vh]">
          <div className="p-4 font-semibold text-lg border-b border-gray-700 flex justify-between items-center">
            Chats
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-300 hover:text-white">
              <ChevronLeft />
            </button>
          </div>
          <div className="overflow-y-auto h-full">
            {chatList.length === 0 ? (
              <div className="p-4 text-sm text-gray-300">No chats available.</div>
            ) : (
              chatList.map((chatItem) => {
                const isActive = receiverId === chatItem._id;
                return (
                  <div
                    key={chatItem._id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-800 ${
                      isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => navigate(`/chat/${chatItem._id}`)}
                  >
                    <img
                      src={chatItem.avatar || '/default-profile.png'}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-white">{chatItem.fullName}</h3>
                      <p className="text-sm text-gray-400 truncate w-40">{chatItem.lastMessage}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-gray-900 text-white px-2 py-1 rounded-lg h-fit self-start mt-2"
        >
          <ChevronRight />
        </button>
      )}

      <div className="w-full md:w-[50%] mx-auto flex flex-col bg-white rounded-xl shadow-lg h-[85vh]">
        {receiverData && (
          <div className="flex items-center gap-3 p-4 border-b cursor-pointer" onClick={() => navigate(`/profile/${receiverData._id}`)}>
            <img src={receiverData.avatar || '/default-profile.png'} alt="avatar" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-medium text-gray-800">{receiverData.fullName}</h3>
              <p className="text-sm text-gray-500">
                {isOnline ? 'Online' : lastSeen ? `Last seen ${dayjs(lastSeen).fromNow()}` : 'Offline'}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 p-4 overflow-y-auto bg-gray-100" ref={chatContainerRef}>
          {chat.map((msg, idx) => (
            <div key={idx} className={`mb-3 flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-xl max-w-[60%] shadow ${
                msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border'
              }`}>
                <span>{msg.content}</span>
                {msg.senderId === user?._id && (
                  <span className="text-xs ml-2">{msg.read ? '✓✓' : '✓'}</span>
                )}
              </div>
            </div>
          ))}
          {typingUser && (
            <div className="text-sm italic text-gray-500">Typing...</div>
          )}
        </div>

        <div className="flex items-center p-4 border-t">
          <input
            type="text"
            value={message}
            onChange={(e) => { setMessage(e.target.value); handleTyping(); }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
