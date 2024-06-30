import express from 'express';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';
import MistralClient from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const client = new MistralClient(process.env.MISTRAL_API_KEY);

const corsOptions = {
  origin: 'https://watchdog-aipoweredwebsiteanalyzer.vercel.app', // Update with your actual frontend URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Proxy server is running');
});

app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  console.log(`Received request to analyze URL: ${url}`);

  if (!isValidURL(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const text = await fetchWebsiteText(url);
    console.log(`Fetched text from ${url}`);
    const aiAnalysis = await analyzeTextWithAI(text);
    console.log(`AI Analysis completed for ${url}`);
    
    res.json({ text, aiAnalysis });
  } catch (error) {
    console.error('Error fetching URL or analyzing text:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/chatbot', async (req, res) => {
  const { text, question } = req.body;
  const prompt = `You are a chatbot that can answer questions based on the following website text:\n\n${text}\n\nQuestion: ${question}\n\nAnswer:`;

  try {
    const chatStreamResponse = await client.chatStream({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    let aiResponse = '';
    for await (const chunk of chatStreamResponse) {
      if (chunk.choices[0].delta.content !== undefined) {
        aiResponse += chunk.choices[0].delta.content;
      }
    }

    res.json({ answer: aiResponse });
  } catch (error) {
    console.error('Mistral API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function fetchWebsiteText(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const relevantText = [];

    $('p, span, h1, h2, h3, h4, h5, h6').each((index, element) => {
      const text = $(element).clone()    
                          .children()    
                          .remove()    
                          .end()        
                          .text();      
      if (text.trim().length > 0) {
        relevantText.push(text.trim()); 
      }
    });

    return relevantText.join('\n'); 
  } catch (error) {
    console.error('Error fetching website text:', error);
    throw new Error('Error fetching website text');
  }
}

async function analyzeTextWithAI(text) {
  const prompt = `Analyze the following text focusing on the product described:

  1. Problem: What problem does the product solve?
  2. Solution: How does the product solve the problem? Features and benefits?
  3. Target Customers: Who are the ideal customers for this product?
  4. Use Cases: Provide real-world examples of how this product is used.
  5. Comparison: Compare this product with similar products based on their specifications.
  
  Product Description:
${text}`;

  try {
    const chatStreamResponse = await client.chatStream({
      model: 'mistral-tiny',
      messages: [{ role: 'user', content: prompt }],
    });

    let aiResponse = '';
    for await (const chunk of chatStreamResponse) {
      if (chunk.choices[0].delta.content !== undefined) {
        aiResponse += chunk.choices[0].delta.content;
      }
    }

    return aiResponse;
  } catch (error) {
    console.error('Error in analyzeTextWithAI:', error);
    throw new Error('An error occurred while communicating with the Mistral API');
  }
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
