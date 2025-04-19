import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const socket = io('http://localhost:8000');

const GlobalChat = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.emit('join-global-chat');

    const fetchMessages = async () => {
      const res = await fetch('http://localhost:8000/api/global-chat');
      const data = await res.json();
      setMessages(data);
    };

    fetchMessages();
    socket.on('receive-global-message', (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off('receive-global-message');
  }, []);

  const sendMessage = () => {
    if (!user || !input.trim()) return;
    const newMsg = {
      senderId: user._id,
      senderName: user.fullName,
      message: input,
      timestamp: new Date(),
    };
    socket.emit('global-message', newMsg);
    setInput('');
  };

  const grouped = messages.reduce((acc, msg) => {
    const date = dayjs(msg.timestamp).format('DD MMM YYYY');
    acc[date] = [...(acc[date] || []), msg];
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-gray-200 via-gray-50 to-gray-200">
    <div className="max-w-2xl mx-auto p-4  ">
      <h2 className="text-2xl font-bold text-center text-purple-400 mb-4">🌐 Global Chat</h2>

      <div className="h-[20rem] overflow-y-auto p-4 rounded-xl bg-gradient-to-br from-pink-100 to-blue-100 shadow space-y-4">
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center text-sm text-purple-500 font-medium mb-2">{date}</div>
            {msgs.map((msg, i) => {
              const mine = msg.senderId === user?._id;
              return (
                <div key={i} className={`flex ${mine ? 'justify-end' : 'justify-start'} mb-1`}>
                  <div className={`max-w-xs px-3 py-2 rounded-xl text-sm shadow-md ${
                    mine ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'
                  }`}>
                    <Link
                      to={`/profile/${msg.senderId}`}
                      className={`font-semibold text-xs block mb-1 ${
                        mine ? 'text-pink-200' : 'text-blue-600 hover:underline'
                      }`}
                    >
                      {mine ? 'You' : msg.senderName}
                    </Link>
                    <div>{msg.message}</div>
                    <div className="text-right text-[10px] mt-1 text-gray-400">
                      {dayjs(msg.timestamp).format('hh:mm A')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          className="flex-grow px-4 py-2 rounded-full border focus:ring-2 focus:ring-purple-400"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-5 py-2 rounded-full hover:bg-purple-700 transition"
        >
          Send
        </button>
      </div>
    </div>
    </div>
  );
};

export default GlobalChat;
