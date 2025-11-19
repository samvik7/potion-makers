import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Inventory from '../models/Inventory.js';
import Item from '../models/Item.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();
const TOKEN_EXPIRES_SECONDS = 60 * 60 * 24 * 7;

function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: TOKEN_EXPIRES_SECONDS });
}

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });

    const starterItemNames = ['Water Vial', 'Herb'];
    const starterItems = await Item.find({ name: { $in: starterItemNames } });
    if (starterItems.length > 0) {
      const inventoryOps = starterItems.map(item => ({
        user: user._id,
        item: item._id,
        quantity: item.name === 'Water Vial' ? 3 : 2,
      }));
      await Inventory.insertMany(inventoryOps).catch(err => console.error("Error giving starter items:", err));
    }

    const token = createToken(user);
    
    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: TOKEN_EXPIRES_SECONDS * 1000
    };
    res.cookie('token', token, cookieOptions);

    const safeUser = { id: user._id, username: user.username, role: user.role, gold: user.gold };
    res.status(201).json({ user: safeUser });

  } catch (err) {
    console.error('register', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = createToken(user);

    const cookieOptions = {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: TOKEN_EXPIRES_SECONDS * 1000
    };
    res.cookie('token', token, cookieOptions);

    const safeUser = { id: user._id, username: user.username, role: user.role, gold: user.gold };
    res.json({ user: safeUser });

  } catch (err) {
    console.error('login', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.get('/session', authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ user: null });
    }

    res.json({ user });

  } catch (err) {
    console.error('session error', err);
    res.status(500).json({ error: 'Server error checking session' });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('token', '', { 
    httpOnly: true, 
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;