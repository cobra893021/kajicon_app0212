import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// In-memory counter for daily limit
let dailyCount = 0;
let lastResetDate = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
const DAILY_LIMIT = 50;

app.use(express.json());

// API endpoint to check and increment daily limit
app.post('/api/check-limit', (req, res) => {
  const today = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });

  // Reset counter if date has changed
  if (today !== lastResetDate) {
    dailyCount = 0;
    lastResetDate = today;
  }

  if (dailyCount >= DAILY_LIMIT) {
    return res.status(429).json({ error: 'Daily limit reached' });
  }

  dailyCount++;
  console.log(`Diagnosis requested. Count for ${today}: ${dailyCount}/${DAILY_LIMIT}`);
  
  res.json({ success: true, count: dailyCount });
});

// Serve static assets except index.html (handled by wildcard route)
app.use(express.static(distPath, { index: false }));

// Handle all other routes by serving index.html with injected config
app.get('*', (req, res) => {
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('Build not found. Run npm run build.');
  }

  let html = fs.readFileSync(indexPath, 'utf-8');
  const apiKey = process.env.API_KEY || '';
  
  // Inject runtime environment variables
  // This replaces the <!-- ENV_CONFIG --> placeholder in index.html
  const envScript = `<script>window.env = { API_KEY: "${apiKey}" };</script>`;
  html = html.replace('<!-- ENV_CONFIG -->', envScript);

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});