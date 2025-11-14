import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import adminRoutes from './routes/admin.js';

// Load environment variables from .env file
dotenv.config();

// --- CONFIGURATION ---
// These are now all cleanly loaded from your .env file
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = process.env.CLIENT_URL;

const app = express();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: CLIENT_URL, // This now correctly uses the variable from .env
  credentials: true
}));

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// --- HEALTH CHECK ---
// A simple route to check if the server is running. This is good practice.
app.get('/', (req, res) => res.json({ message: 'Potion Makers API is running!' }));

// --- STARTUP LOGIC ---
async function start() {
  // A check to make sure essential variables are loaded
  if (!MONGO_URI || !CLIENT_URL) {
    console.error('FATAL ERROR: MONGO_URI and CLIENT_URL must be defined in your .env file.');
    process.exit(1);
  }

  try {
    // --- IMPROVEMENT: Removed deprecated options ---
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1); // Exit the process if the database connection fails
  }
}

start();
