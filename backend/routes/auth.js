import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Inventory from '../models/Inventory.js';
import Item from '../models/Item.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = 60 * 60 * 24 * 7; // 7 days

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    // Add backend password validation
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });

    // Give starter items more robustly 
    const starterItemNames = ['Water Vial', 'Herb']; 
    const starterItems = await Item.find({ name: { $in: starterItemNames } });
    
    if (starterItems.length > 0) {
      const inventoryOps = starterItems.map(item => ({
        user: user._id,
        item: item._id,
        // Use quantity to match the improved Inventory schema
        quantity: item.name === 'Water Vial' ? 3 : 2, 
      }));
      await Inventory.insertMany(inventoryOps).catch(err => console.error("Error giving starter items:", err));
    }

    const token = createToken(user);
    // Add Secure flag for production environments 
    const cookieOptions = { 
      httpOnly: true, 
      sameSite: 'lax',
      // The 'secure' flag ensures the cookie is only sent over HTTPS
      secure: process.env.NODE_ENV === 'production' 
    };
    res.cookie('token', token, cookieOptions);

    const safeUser = { id: user._id, username: user.username, role: user.role, gold: user.gold };
    res.status(201).json({ user: safeUser }); 

  } catch (err) {
    console.error('register', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
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
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' 
    };
    res.cookie('token', token, cookieOptions);

    const safeUser = { id: user._id, username: user.username, role: user.role, gold: user.gold };
    res.json({ user: safeUser });

  } catch (err) {
    console.error('login', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET /api/auth/session - Checks if a user is currently logged in
router.get('/session', async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.json({ user: null });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash'); 
    if (!user) {
      return res.json({ user: null });
    }
    const safeUser = { id: user._id, username: user.username, role: user.role, gold: user.gold };
    res.json({ user: safeUser });
  } catch (err) {
    return res.json({ user: null });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;