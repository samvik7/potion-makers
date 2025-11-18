import express from 'express';
import { authRequired, adminOnly } from '../middleware/authMiddleware.js';
import Item from '../models/Item.js';
import Recipe from '../models/Recipe.js';

console.log("✅ admin.js loaded!");
const router = express.Router();



// GET /api/admin/items - list all items
router.get('/items', authRequired, adminOnly, async (req, res) => {
  try {
    const items = await Item.find().lean();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching items' });
  }
});

// POST /api/admin/items - create item
router.post('/items', authRequired, adminOnly, async (req, res) => {
  try {
    const { name, type, basePrice, description } = req.body;
    if (!name || !type || !basePrice) {
      return res.status(400).json({ error: 'Name, type, and basePrice are required' });
    }
    const item = await Item.create({ name, type, basePrice, description });
    res.status(201).json(item); 
  } catch (err) {
    if (err.code === 11000) { 
      return res.status(400).json({ error: 'An item with this name already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error creating item' });
  }
});

// PUT /api/admin/items/:id - update
router.put('/items/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating item' });
  }
});

// DELETE /api/admin/items/:id
router.delete('/items/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ ok: true, message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting item' });
  }
});


// GET /api/admin/recipes - list all recipes
router.get('/recipes', authRequired, adminOnly, async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('resultItem').lean();
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching recipes' });
  }
});

// POST /api/admin/recipes - create recipe
router.post('/recipes', authRequired, adminOnly, async (req, res) => {
  try {
    const { name, combo, resultItemId } = req.body;
    if (!name || !combo || !resultItemId) {
      return res.status(400).json({ error: 'Name, combo, and resultItemId are required' });
    }
    const signature = (combo || []).map(c => `${c.itemId}:${c.qty}`).sort().join('|');
    const recipe = await Recipe.create({ ...req.body, resultItem: resultItemId, signature });
    res.status(201).json(recipe);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A recipe with this name or signature already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error creating recipe' });
  }
});

// PUT /api/admin/recipes/:id - update recipe
router.put('/recipes/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating recipe' });
  }
});

// DELETE /api/admin/recipes/:id - delete recipe
router.delete('/recipes/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ ok: true, message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting recipe' });
  }
});

export default router;
