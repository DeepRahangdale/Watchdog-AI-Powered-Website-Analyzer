import React, { useEffect, useState } from 'react';
import ChatbotComponent from './Chatbot';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './History.css';

function History() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:3001/history', {
          headers: {
            'Authorization': await auth.currentUser.getIdToken(),
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching history: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setAnalyses(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleViewDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    setShowChatbot(true);
  };

  return (
    <div className="history-container">
      <h2>Analysis History</h2>
      <div className="analysis-list">
        {analyses.map((analysis) => (
          <div key={analysis._id} className="analysis-item">
            <p><strong>Website:</strong> {analysis.url}</p>
            <p>
              <strong>Summary:</strong> {analysis.aiAnalysis.split('\n')[0]} 
            </p>
            <button onClick={() => handleViewDetails(analysis)} className="view-details-button">
              View Details
            </button>
          </div>
        ))}
      </div>

      {selectedAnalysis && (
        <div className="analysis-details">
          <h3>Detailed Analysis:</h3>
          <pre>{selectedAnalysis.aiAnalysis}</pre> 
          <ChatbotComponent initialMessage={selectedAnalysis.text} />
        </div>
      )}
    </div>
  );
}

export default History;
