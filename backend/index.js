require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { MongoClient } = require('mongodb');

const app  = express();
const PORT = process.env.PORT || 3001;
const DB_NAME = process.env.MONGODB_DB_NAME || 'date_app';

// ── MongoDB ───────────────────────────────────────────────────────────────────
if (!process.env.MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI, {
  tls: true,
  serverSelectionTimeoutMS: 10000,
});
let db;

async function connectDB() {
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`✅  Connected to MongoDB (${DB_NAME})`);
}

function ensureDb(res) {
  if (db) return true;
  res.status(503).json({ error: 'Database not ready yet. Please retry shortly.' });
  return false;
}

async function connectWithRetry() {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to MongoDB. Retrying in 10s:', err.message);
    setTimeout(connectWithRetry, 10000);
  }
}

// ── Middleware ─────────────────────────────────────────────────────────────────
// Allow requests from any origin (lock this down to your Netlify URL in prod if you like)
app.use(cors());
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────

// Health check — Render pings this to keep the service awake
app.get('/', (_req, res) => res.json({ status: 'ok' }));

// Save a confirmed booking
app.post('/api/booking', async (req, res) => {
  try {
    if (!ensureDb(res)) return;

    const { day, time, items } = req.body;

    if (!day || !time || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: day, time, items' });
    }

    const result = await db.collection('bookings').insertOne({
      day,
      time,
      items,
      confirmedAt: new Date(),
    });

    console.log(`📅  Booking saved: ${result.insertedId}`);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

// List all bookings (for your own debugging)
app.get('/api/bookings', async (_req, res) => {
  try {
    if (!ensureDb(res)) return;

    const bookings = await db
      .collection('bookings')
      .find({})
      .sort({ confirmedAt: -1 })
      .toArray();
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  API running on http://localhost:${PORT}`);
  connectWithRetry();
});
