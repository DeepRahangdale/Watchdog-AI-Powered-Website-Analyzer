import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core'; // Import puppeteer-core
import MistralClient from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const client = new MistralClient(process.env.MISTRAL_API_KEY);

const corsOptions = {
  origin: 'https://your-frontend-site.onrender.com', // Update with your actual frontend URL
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
  let browser;
  try {
    console.log('Starting Puppeteer...');
    browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Update with your Chrome or Chromium executable path
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--headless',
        '--remote-debugging-port=9222'
      ],
    });
    const page = await browser.newPage();
    console.log('Navigating to URL:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    console.log('Page loaded:', url);

    const text = await page.evaluate(() => document.body.innerText);
    console.log('Extracted text from page');

    return text;
  } catch (error) {
    console.error('Error in fetchWebsiteText:', error);
    throw new Error('Error fetching website text');
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed');
    }
  }
}

async function analyzeTextWithAI(text) {
  const prompt = `Analyze the following website text, focusing on these key points:

1. Problem: What problem does the product/service solve?
2. Solution: How does it solve the problem? Features and benefits?
3. Target Customers: Who are the ideal customers?
4. Use Cases: Provide real-world examples of product/service usage.

Website Text:
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
