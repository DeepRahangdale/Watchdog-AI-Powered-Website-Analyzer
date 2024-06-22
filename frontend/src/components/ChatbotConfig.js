// src/components/ChatbotConfig.js
import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'ProductPro'; // Customize your bot's name

const config = {
  botName: botName,
  initialMessages: [
    createChatBotMessage(
      "Hi there! I'm ProductPro, your product analysis assistant. 🤖\n\nPlease share a website URL, and I'll analyze it for you!"
    ),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: '#DCF8C6', // Light green for bot messages
    },
    chatButton: {
      backgroundColor: '#4CAF50', // Green for the chat button
    },
  },
  widgets: [
    {
      widgetName: "productAnalysis",
      widgetFunc: (props) => <ProductAnalysisWidget {...props} />,
      mapStateToProps: ["analysis"], // Pass analysis data to the widget
    },
  ],
};

function ProductAnalysisWidget({ analysis }) {
  if (!analysis) {
    return null; // Don't render if no analysis is available
  }

  return (
    <div>
      <h3>Analysis Results:</h3>
      <p><strong>Problem:</strong> {analysis.problem}</p>
      <p><strong>Solutions:</strong> {analysis.solutions}</p>
      <p><strong>Target Customers:</strong> {analysis.customers}</p>
      <p><strong>Use Cases:</strong> {analysis.useCases}</p>
    </div>
  );
}

export default config;
