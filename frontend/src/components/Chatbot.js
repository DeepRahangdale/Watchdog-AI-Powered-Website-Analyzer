import React, { useState } from 'react';
import { useChatbot } from './useChatbot';
import './ChatbotComponent.css';

const ChatbotComponent = ({ text }) => {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const { sendMessage, loading } = useChatbot(text);

  const handleSend = async () => {
    if (!message.trim()) return;
    const response = await sendMessage(message);
    setResponses([...responses, { question: message, answer: response }]);
    setMessage('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {responses.map((resp, index) => (
          <div key={index} className="chatbot-message">
            <div className="user-message">
              <strong>You:</strong> {resp.question}
            </div>
            <div className="bot-response">
              <strong>Bot:</strong> {resp.answer}
            </div>
          </div>
        ))}
      </div>
      <div className="chatbot-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question..."
          className="chatbot-input"
        />
        <button onClick={handleSend} disabled={loading} className="send-button">
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatbotComponent;
