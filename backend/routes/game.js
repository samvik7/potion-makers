import express from 'express';
import mongoose from 'mongoose';
import { authRequired } from '../middleware/authMiddleware.js';
import Inventory from '../models/Inventory.js';
import Item from '../models/Item.js';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

const router = express.Router();

function signatureFromCombo(combo) {
  return combo.map(c => `${c.itemId}:${c.qty}`).sort().join('|');
}

router.get('/gamestate', authRequired, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-passwordHash').lean();
    const inventory = await Inventory.find({ user: userId }).populate('item').lean();
    const discovered = await Recipe.find({ _id: { $in: user.discoveredRecipes || [] } }).lean();
    res.json({
      gold: user.gold,
      inventory,
      discovered
    });
  } catch (err) {
    console.error('gamestate', err);
    res.status(500).json({ error: 'Server error fetching game state' });
  }
});

router.get('/shop-items', authRequired, async (req, res) => {
  try {
    const itemsForSale = await Item.find({ type: 'Ingredient' }).sort({ basePrice: 1 }).lean();
    res.json(itemsForSale);
  } catch (err) {
    console.error('shop-items', err);
    res.status(500).json({ error: 'Server error fetching shop items' });
  }
});

router.get('/rankings', authRequired, async (req, res) => {
  try {
    const rankings = await User.find()
      .sort({ gold: -1 })
      .limit(10)
      .select('username gold')
      .lean();
    res.json(rankings);
  } catch (err) {
    console.error('rankings', err);
    res.status(500).json({ error: 'Server error fetching rankings' });
  }
});

router.post('/craft', authRequired, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.userId;
    const { combo } = req.body;
    if (!Array.isArray(combo) || combo.length === 0) {
      return res.status(400).json({ error: 'No combo provided' });
    }

    const sig = signatureFromCombo(combo);
    const recipe = await Recipe.findOne({ signature: sig }).populate('resultItem').session(session);
    if (!recipe) {
      return res.json({ success: false, message: 'The mixture did nothing. Try a different combination.' });
    }

    for (const c of combo) {
      const inv = await Inventory.findOne({ user: userId, item: c.itemId }).session(session);
      if (!inv || inv.quantity < c.qty) { 
        return res.status(400).json({ error: 'Not enough ingredients' });
      }
    }

    if (Math.random() > recipe.chance) {
      return res.json({ success: false, message: 'The mixture fizzled and failed.' });
    }

    for (const c of combo) {
      await Inventory.findOneAndUpdate(
        { user: userId, item: c.itemId },
        { $inc: { quantity: -c.qty } },
        { session }
      );
    }
    await Inventory.deleteMany({ user: userId, quantity: { $lte: 0 } }).session(session);

    await Inventory.findOneAndUpdate(
      { user: userId, item: recipe.resultItem._id },
      { $inc: { quantity: 1 } },
      { upsert: true, new: true, session }
    );

    await User.findByIdAndUpdate(userId, {
      $addToSet: { discoveredRecipes: recipe._id },
      $inc: { gold: recipe.sellValue || 0 }
    }, { session });

    await session.commitTransaction();

    const user = await User.findById(userId).select('gold');
    res.json({
      success: true,
      message: `You created ${recipe.resultItem.name}!`,
      potion: { id: recipe.resultItem._id, name: recipe.resultItem.name },
      gold: user.gold
    });

  } catch (err) {
    await session.abortTransaction();
    console.error('craft', err);
    res.status(500).json({ error: 'Server error during craft' });
  } finally {
    session.endSession();
  }
});

router.post('/buy', authRequired, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.userId;
    const { itemId, qty = 1 } = req.body;

    const itemToBuy = await Item.findById(itemId).session(session);
    if (!itemToBuy) return res.status(404).json({ error: 'Item not found' });
    if (qty <= 0) return res.status(400).json({ error: 'Invalid quantity' });

    const cost = (itemToBuy.basePrice || 1) * qty;
    const user = await User.findById(userId).session(session);

    if (user.gold < cost) return res.status(400).json({ error: 'Not enough gold' });

    user.gold -= cost;
    await user.save({ session });
    
    await Inventory.findOneAndUpdate(
      { user: userId, item: itemId },
      { $inc: { quantity: qty } },
      { upsert: true, session }
    );
    
    await session.commitTransaction();
    res.json({ ok: true, gold: user.gold });

  } catch (err) {
    await session.abortTransaction();
    console.error('buy', err);
    res.status(500).json({ error: 'Server error during purchase' });
  } finally {
    session.endSession();
  }
});

router.post('/sell', authRequired, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.userId;
    const { itemId, qty = 1 } = req.body;
    const item = await Item.findById(itemId).session(session);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const inv = await Inventory.findOne({ user: userId, item: itemId }).session(session);
    if (!inv || inv.quantity < qty) return res.status(400).json({ error: 'Not enough to sell' });

    const user = await User.findById(userId).session(session);
    const gain = (item.basePrice || 1) * qty;
    user.gold += gain;
    await user.save({ session });

    inv.quantity -= qty;
    if (inv.quantity <= 0) await inv.deleteOne({ session });
    else await inv.save({ session });

    await session.commitTransaction();
    res.json({ ok: true, gold: user.gold });
  } catch (err) {
    await session.abortTransaction();
    console.error('sell', err);
    res.status(500).json({ error: 'Server error during sell' });
  } finally {
    session.endSession();
  }
});

export default router;
