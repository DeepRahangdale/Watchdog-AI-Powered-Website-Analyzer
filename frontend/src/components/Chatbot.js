import React, { useState } from 'react';
import { useChatbot } from './useChatbot';

function ChatbotComponent({ text }) {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const { sendMessage, loading } = useChatbot(text);

  const handleSendMessage = async () => {
    const response = await sendMessage(message);
    setResponses([...responses, { message, response }]);
    setMessage('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {responses.map((res, index) => (
          <div key={index} className="chatbot-message">
            <p><strong>You:</strong> {res.message}</p>
            <p><strong>Bot:</strong> {res.response}</p>
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          disabled={loading}
        />
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Loading...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatbotComponent;
