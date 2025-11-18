import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_URL = 'http://localhost:5173';

const app = express();

app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// --- DIAGNOSTIC LOGGING MIDDLEWARE ---
app.use((req, res, next) => {
  console.log(`--> Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.json({ message: 'Potion Makers API is running!' }));

async function start() {
  if (!MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI must be defined.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is ready and running on http://localhost:${PORT}`);
    });

  } catch (err)
 {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();