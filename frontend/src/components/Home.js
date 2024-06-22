import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import ChatbotComponent from './Chatbot';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { ThreeDots } from 'react-loader-spinner';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

function Home() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a valid website URL.');
      return;
    }
    setError(null);
    setLoading(true);
    setShowChatbot(false); 
  
    try {
      const proxyUrl = `http://localhost:3001/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        headers: { 'Accept': 'application/json' }
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching from proxy server: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Data received:', data); // Log the received data
      if (data.error) {
        throw new Error(data.error);
      }
  
      const newAnalysis = { url, aiAnalysis: data.aiAnalysis, timestamp: new Date() };
  
      setAnalysis(newAnalysis);
      await addDoc(collection(db, 'analyses'), newAnalysis);
      setShowChatbot(true);
    } catch (error) {
      console.error('Error analyzing website:', error.message);
      setError(error.message); 
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="home-container">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
        className="url-input"
      />
      <button onClick={handleAnalyze} disabled={!url || loading} className="analyze-button">
        {loading ? (
          <ThreeDots height="20" width="50" radius="9" color="#4CAF50" ariaLabel="three-dots-loading" />
        ) : 'Analyze'}
      </button>

      {error && <div className="error-message" role="alert">
        <span>Error:</span> {error}
      </div>}

      {analysis && (
        <div className="analysis-results">
          <h3>Analysis Results:</h3>
          <p><strong>AI Analysis:</strong></p>
          {analysis.aiAnalysis.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
      {user && ( 
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      )}
      {showChatbot && <ChatbotComponent analysis={analysis} />}
    </div>
  );
}


export default Home;
