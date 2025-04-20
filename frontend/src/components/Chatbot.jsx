import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            past_user_inputs: newMessages.filter(msg => msg.sender === 'user').map(m => m.text),
            generated_responses: newMessages.filter(msg => msg.sender === 'bot').map(m => m.text),
            text: userInput,
          },
        }),
      });

      const data = await response.json();
      const botReply = data.generated_text || '❌ Something went wrong.';

      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    } catch (err) {
      console.error('Hugging Face API error:', err);
      setMessages([...newMessages, { sender: 'bot', text: '❌ Failed to fetch response.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">🤖 AI Chatbot</h2>
      <div className="h-80 overflow-y-auto border p-4 mb-4 rounded">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">Bot is typing...</div>}
      </div>
      <div className="flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow px-4 py-2 border rounded-l"
          placeholder="Ask me anything..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
