import express from 'express';
import User from '../models/User.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Player Rankings
router.get('/', authRequired, async (req, res) => {
  try {
    const players = await User.find({ role: { $in: ["Player", "Admin", "player"] } })
      .select('username gold createdAt')
      .sort({ gold: -1 }) // Highest gold first
      .lean();

    res.json(players);

  } catch (err) {
    console.error('rankings', err);
    res.status(500).json({ error: 'Failed to fetch rankings' });
  }
});

export default router;
