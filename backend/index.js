require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { MongoClient } = require('mongodb');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── MongoDB ───────────────────────────────────────────────────────────────────
if (!process.env.MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set in .env');
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
  await client.connect();
  db = client.db('date_app');
  console.log('✅  Connected to MongoDB');
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
    const bookings = await db
      .collection('bookings')
      .find({})
      .sort({ confirmedAt: -1 })
      .toArray();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ── Start ──────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀  API running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
