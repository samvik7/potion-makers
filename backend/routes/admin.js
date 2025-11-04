console.log("✅ admin.js loaded!");
import express from 'express'
import { authRequired, adminOnly } from '../middleware/authMiddleware.js'
import Item from '../models/Item.js'
import Recipe from '../models/Recipe.js'

const router = express.Router()

// GET /api/admin/items - list all items
router.get('/items', authRequired, async (req, res) => {
  try {
    const items = await Item.find().lean()
    res.json(items)
  } catch(err) { res.status(500).json({ error: 'Server error' }) }
})

// POST /api/admin/items - create item
router.post('/items', authRequired, adminOnly, async (req, res) => {
  try {
    const { name, type, basePrice, description } = req.body
    const item = await Item.create({ name, type, basePrice, description })
    res.json(item)
  } catch(err) { res.status(500).json({ error: 'Server error' }) }
})

// PUT /api/admin/items/:id - update
router.put('/items/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(item)
  } catch(err) { res.status(500).json({ error: 'Server error' }) }
})

// DELETE /api/admin/items/:id
router.delete('/items/:id', authRequired, adminOnly, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch(err) { res.status(500).json({ error: 'Server error' }) }
})

// Recipes endpoints - create with signature
router.get('/recipes', authRequired, async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('resultItem').lean()
    res.json(recipes)
  } catch(err) { res.status(500).json({ error: 'Server error' }) }
})

router.post('/recipes', authRequired, adminOnly, async (req, res) => {
  try {
    const { name, combo, resultItemId, chance = 1, sellValue = 0, notes = '' } = req.body
    // combo: [{ itemId, qty }]
    const signature = (combo || []).map(c => `${c.itemId}:${c.qty}`).sort().join('|')
    const recipe = await Recipe.create({
      name, signature, resultItem: resultItemId, chance, sellValue, notes
    })
    res.json(recipe)
  } catch(err) { console.error(err); res.status(500).json({ error: 'Server error' }) }
})

router.put('/recipes/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(recipe)
  } catch(err) { res.status(500).json({ error: 'Server error' }) }
})

router.delete('/recipes/:id', authRequired, adminOnly, async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch(err) { res.status(500).json({ error: 'Server error' }) }
})

export default router
