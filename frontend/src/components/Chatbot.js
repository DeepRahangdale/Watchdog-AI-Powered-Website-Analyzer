import React, { useState, useEffect } from 'react';
import ChatBot from 'react-chatbot-kit';
import { isAuthenticated } from '../firebase';
import config from './ChatbotConfig'; // Import your chatbot configuration
import MessageParser from './MessageParser'; // Import your message parser
import ActionProvider from './ActionProvider'; // Import your action provider

function ChatbotComponent({ analysis }) {
  const handleWelcomeMessage = (chatbot) => {
    if (analysis) {
      const initialMessage = `Hi there! I've analyzed the website you provided. Here's what I found:\n\n${analysis.aiAnalysis}\n\nHow can I help you further?`;
      chatbot.sendMessage(initialMessage);
    } else {
      chatbot.sendMessage("Hi there! How can I help you with product analysis?");
    }
  };

  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    if (isAuthenticated() && analysis) {
      setShowChatbot(true);
    }
  }, [analysis]);

  return (
    showChatbot && (
      <ChatBot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        headerText="Product Analysis Chatbot"
        placeholderText="Ask me about the product..."
      />
    )
  );
}

export default ChatbotComponent;
