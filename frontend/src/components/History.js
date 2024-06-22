import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

function History() {
  const [analyses, setAnalyses] = useState([]);
  const [filter, setFilter] = useState(''); // Add filter state

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        let q = query(collection(db, 'analyses'), orderBy('timestamp', 'desc')); // Order by timestamp

        if (filter) {
          q = query(q, where('url', '==', filter)); // Filter by URL if filter is present
        }

        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toLocaleString() // Format timestamp
        }));
        setAnalyses(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchAnalyses();
  }, [filter]); // Re-fetch when filter changes

  return (
    <div>
      <h2>Analysis History</h2>

      <input 
        type="text" 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        placeholder="Filter by URL" 
      />

      <ul>
        {analyses.map(analysis => (
          <li key={analysis.id}>
            <p><strong>URL:</strong> {analysis.url}</p>
            <p><strong>Problem:</strong> {analysis.problem}</p>
            <p><strong>Solutions:</strong> {analysis.solutions}</p>
            <p><strong>Target Customers:</strong> {analysis.customers}</p>
            <p><strong>Use Cases:</strong> {analysis.useCases}</p>
            <p><strong>Analyzed At:</strong> {analysis.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
