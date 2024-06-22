const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const puppeteer = require('puppeteer');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); 

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/proxy', limiter);

const cache = new Map();
const CACHE_EXPIRATION_TIME = 3600 * 1000; 

app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    
    if (cache.has(url)) {
      const cachedData = cache.get(url);
      if (Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
        return res.json(cachedData);
      }
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.3'
    );

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 }); // 30-second timeout
    } catch (error) {
      console.error("Navigation Error:", error.message);
      res.status(500).json({ error: "Could not fetch data, Timed out or unreachable!" });
      await browser.close(); // Close the browser if navigation fails
      return; // Prevent further execution
    }

    // Extract text content
    const text = await page.evaluate(() => {
      const bodyText = document.body.innerText; 
      
      // Remove common elements that might not be relevant for analysis
      const selectorsToAvoid = ['script', 'style', 'header', 'footer', 'nav', 'form', '[role="navigation"]', '[aria-label="navigation"]', 'button', 'svg', 'iframe'];
      selectorsToAvoid.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      });
      return document.body.innerText;
    });

    await browser.close(); // Close the browser after extraction

    const data = { text, timestamp: Date.now() };
    cache.set(url, data); 
    res.json(data);
  } catch (error) {
    console.error(`Error fetching or parsing ${url}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});


app.get('/', (req, res) => {
  res.send('Proxy server is running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
