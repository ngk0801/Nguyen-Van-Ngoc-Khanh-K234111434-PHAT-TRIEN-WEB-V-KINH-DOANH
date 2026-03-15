const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDER_FILE = path.join(DATA_DIR, 'orderData.json');

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, 'shop')));

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

// Health check
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Get current order
app.get('/api/order', async (req, res) => {
  try {
    await ensureDataDir();
    const content = await fs.readFile(ORDER_FILE, 'utf8');
    const json = JSON.parse(content);
    return res.json(json);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ error: 'No order found' });
    }
    console.error('Error reading order file:', err);
    return res.status(500).json({ error: 'Failed to read order' });
  }
});

// Save/Replace current order
app.post('/api/order', async (req, res) => {
  try {
    await ensureDataDir();
    const orderData = req.body || {};
    // Basic validation
    if (!orderData || typeof orderData !== 'object') {
      return res.status(400).json({ error: 'Invalid order payload' });
    }
    orderData.savedAt = new Date().toISOString();
    await fs.writeFile(ORDER_FILE, JSON.stringify(orderData, null, 2), 'utf8');
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Error writing order file:', err);
    return res.status(500).json({ error: 'Failed to save order' });
  }
});

// Delete current order
app.delete('/api/order', async (req, res) => {
  try {
    await fs.unlink(ORDER_FILE);
    return res.json({ ok: true });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.json({ ok: true });
    }
    console.error('Error deleting order file:', err);
    return res.status(500).json({ error: 'Failed to delete order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Open http://localhost:' + PORT + '/cart/cart.html');
});
