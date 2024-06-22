import React, { useState } from 'react';
import client from '../openai';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import ChatbotComponent from './Chatbot';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { ThreeDots } from 'react-loader-spinner';

function Home() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

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
      if (data.error) {
        throw new Error(data.error);
      }

      const aiAnalysis = await analyzeWebsiteWithAI(data.text);
      const newAnalysis = { url, aiAnalysis, timestamp: new Date() };

      setAnalysis(newAnalysis);
      await addDoc(collection(db, 'analyses'), newAnalysis);
      setShowChatbot(true); // Show chatbot after successful analysis
    } catch (error) {
      console.error('Error analyzing website:', error);
      setError(error.message); 
    } finally {
      setLoading(false);
    }
  };

  async function analyzeWebsiteWithAI(text) {
    const prompt = `Analyze the following website text, focusing on these key points:

    1. Problem: What problem does the product/service solve?
    2. Solution: How does it solve the problem? Features and benefits?
    3. Target Customers: Who are the ideal customers?
    4. Use Cases: Provide real-world examples of product/service usage.

    Website Text:
    ${text}
    `;

    try {
      const response = await client.chat({
        model: 'mistral-large-latest', // Or the model you want to use
        messages: [{ role: 'user', content: prompt }],
        headers: { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` } // Include the API key here
      });
      console.log(response.data);
      if (!response.choices || response.choices.length === 0) {
        throw new Error('Mistral API did not return any choices.');
      }

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Mistral API Error:', error);

      if (error.response && error.response.status === 401) {
        throw new Error('Mistral API authentication failed. Please check your API key.');
      } else if (error.response) {
        throw new Error(`Mistral API error (${error.response.status}): ${error.response.data.error || 'Unknown error'}`);
      } else {
        throw new Error('An error occurred while communicating with the Mistral API.');
      }
    }
  }
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
                  <p><strong>AI Analysis:</strong> {analysis.aiAnalysis}</p>
                </div>
              )}
        
              {showChatbot && <ChatbotComponent analysis={analysis} />}
            </div>
          );
    }
export default Home;




// import React, { useState } from 'react';
// import openai from '../openai';
// import { db } from '../firebase';
// import { addDoc, collection } from 'firebase/firestore';
// import ChatbotComponent from './Chatbot';
// import { useNavigate } from 'react-router-dom';
// import './Home.css';
// import { ThreeDots } from 'react-loader-spinner';

// function Home() {
//   const [url, setUrl] = useState('');
//   const [analysis, setAnalysis] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showChatbot, setShowChatbot] = useState(false);

//   const handleAnalyze = async () => {
//     if (!url.trim()) {
//       setError('Please enter a valid website URL.');
//       return;
//     }
//     setError(null);
//     setLoading(true);
//     setShowChatbot(false); 

//     try {
//       const proxyUrl = `http://localhost:3001/proxy?url=${encodeURIComponent(url)}`;
//       const response = await fetch(proxyUrl, {
//         headers: { 'Accept': 'application/json' }
//       });

//       if (!response.ok) {
//         throw new Error(`Error fetching from proxy server: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       if (data.error) { 
//         throw new Error(data.error);
//       }

//       const aiAnalysis = await analyzeWebsiteWithAI(data.text);
//       const newAnalysis = { url, aiAnalysis, timestamp: new Date() };

//       setAnalysis(newAnalysis);
//       await addDoc(collection(db, 'analyses'), newAnalysis); 
//       setShowChatbot(true); // Show chatbot after successful analysis
//     } catch (error) {
//       console.error('Error analyzing website:', error);
//       setError(error.message); // Show specific error message to the user
//     } finally {
//       setLoading(false);
//     }
//   };

//   async function analyzeWebsiteWithAI(text) {
//     const prompt = `Analyze the following website text, focusing on these key points:

// 1. Problem: What problem does the product/service solve?
// 2. Solution: How does it solve the problem? Features and benefits?
// 3. Target Customers: Who are the ideal customers?
// 4. Use Cases: Provide real-world examples of product/service usage.

// Website Text:
// ${text}
// `;

//     try {
//       const response = await openai.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: prompt }],
//       });

//       console.log(response.data); // For debugging

//       if (!response.data.choices || response.data.choices.length === 0) {
//         throw new Error('OpenAI API did not return any choices.');
//       }

//       return response.data.choices[0].message.content;
//     } catch (error) {
//       console.error('OpenAI API Error:', error);

//       // More specific error handling based on error message or status code:
//       if (error.response && error.response.status === 429) {
//         throw new Error('OpenAI rate limit exceeded. Please try again later.');
//       } else if (error.response && error.response.status === 401) {
//         throw new Error('OpenAI authentication error. Please check your API key.');
//       } else {
//         throw new Error('OpenAI analysis failed. Please try again later or contact support.'); // Generic error
//       }
//     }
//   }


//   return (
//             <div className="home-container">
//               <input
//                 type="text"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 placeholder="Enter website URL"
//                 className="url-input"
//               />
//               <button onClick={handleAnalyze} disabled={!url || loading} className="analyze-button">
//                 {loading ? (
//                   <ThreeDots height="20" width="50" radius="9" color="#4CAF50" ariaLabel="three-dots-loading" />
//                 ) : 'Analyze'}
//               </button>
        
//               {error && <div className="error-message" role="alert">
//                 <span>Error:</span> {error}
//               </div>}
        
//               {analysis && (
//                 <div className="analysis-results">
//                   <h3>Analysis Results:</h3>
//                   <p><strong>AI Analysis:</strong> {analysis.aiAnalysis}</p>
//                 </div>
//               )}
        
//               {showChatbot && <ChatbotComponent analysis={analysis} />}
//             </div>
//           );
//     }
//     export default Home;

// import React, { useState, useEffect } from 'react';
// import { db} from '../firebase';
// import replicate from '../replicate';
// import { addDoc, collection } from 'firebase/firestore';
// import ChatbotComponent from './Chatbot';
// import { useNavigate } from 'react-router-dom';
// import './Home.css';
// import { ThreeDots } from 'react-loader-spinner';

// function Home() {
//   // ... (other state variables and functions)
//     const [url, setUrl] = useState('');
//   const [analysis, setAnalysis] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showChatbot, setShowChatbot] = useState(false);

//   const handleAnalyze = async () => {
//     // ... (error and loading handling)
//     if (!url.trim()) {
//             setError('Please enter a valid website URL.');
//             return;
//           }
//           setError(null);
//           setLoading(true);
//           setShowChatbot(false);
//     try {
//       const response = await fetch(`http://localhost:3001/proxy?url=${encodeURIComponent(url)}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       try {
//         const aiAnalysis = await analyzeWebsiteWithAI(data.text);
//         const newAnalysis = { url, aiAnalysis, timestamp: new Date() };
//         setAnalysis(newAnalysis);
//         await addDoc(collection(db, 'analyses'), newAnalysis);
//       } catch (replicateError) {
//         console.error('Replicate analysis error:', replicateError);
//         setError('Replicate analysis failed. Please try again later or contact support.');
//       } finally {
//         setShowChatbot(true);
//       }
//     } catch (error) {
//       console.error('Error analyzing website:', error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   async function analyzeWebsiteWithAI(text) {
//     const input = {
//       prompt: `Please analyze the following website text, focusing on these four key points:

// 1.  **Problem:** What specific problem or pain point does the product/service aim to solve?
// 2.  **Solution:** How does the product/service address the identified problem? What are its key features and benefits?
// 3.  **Target Customers:** Who is the ideal customer or user for this product/service? Describe their demographics, interests, or needs.
// 4.  **Use Cases:** Provide a few examples of how the product/service can be used in real-world scenarios.

// Website Text:
// ${text}
// `,
//     };

//     try {
//       const output = await replicate.run(
//         "a16z-infra/llama-2-7b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
//         {
//           input,
//         }
//       );
//       return output;
//     } catch (error) {
//       console.error("Error analyzing with Replicate:", error);
//       throw new Error('Replicate analysis failed. Please try again later or contact support.');
//     }
//   }

//   // ... (rest of the component remains the same)
//   return (
//         <div className="home-container">
//           <input
//             type="text"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             placeholder="Enter website URL"
//             className="url-input"
//           />
//           <button onClick={handleAnalyze} disabled={!url || loading} className="analyze-button">
//             {loading ? (
//               <ThreeDots height="20" width="50" radius="9" color="#4CAF50" ariaLabel="three-dots-loading" />
//             ) : 'Analyze'}
//           </button>
    
//           {error && <div className="error-message" role="alert">
//             <span>Error:</span> {error}
//           </div>}
    
//           {analysis && (
//             <div className="analysis-results">
//               <h3>Analysis Results:</h3>
//               <p><strong>AI Analysis:</strong> {analysis.aiAnalysis}</p>
//             </div>
//           )}
    
//           {showChatbot && <ChatbotComponent analysis={analysis} />}
//         </div>
//       );
// }
// export default Home;