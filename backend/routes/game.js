import express from 'express'
import { authRequired } from '../middleware/authMiddleware.js' 
import Inventory from '../models/Inventory.js'
import Item from '../models/Item.js'
import Recipe from '../models/Recipe.js'
import User from '../models/User.js'

const router = express.Router()

function signatureFromCombo(combo){
  // combo: [{itemId, qty}]
  return combo.map(c => `${c.itemId}:${c.qty}`).sort().join('|')
}

// GET /api/game/gamestate
router.get('/gamestate', authRequired, async (req, res) => {
  try{
    const userId = req.userId
    const user = await User.findById(userId).select('-passwordHash').lean()
    const inventory = await Inventory.find({ user: userId }).populate('item').lean()
    const discovered = await Recipe.find({ _id: { $in: user.discoveredRecipes || [] } }).lean()
    res.json({
      gold: user.gold,
      inventory,
      discovered
    })
  }catch(err){
    console.error('gamestate', err) 
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/game/craft
router.post('/craft', authRequired, async (req, res) => {
  try{
    const userId = req.userId
    const { combo } = req.body
    if(!Array.isArray(combo) || combo.length === 0) return res.status(400).json({ error: 'No combo provided' })

    const sig = signatureFromCombo(combo)
    const recipe = await Recipe.findOne({ signature: sig }).populate('resultItem')
    if(!recipe) {
      // optional: consume a small chance of failing but not consuming all - here we don't consume
      return res.json({ success: false, message: 'The mixture did nothing. Try a different combination.' })
    }

    // check ingredient availability
    for(const c of combo){
      const inv = await Inventory.findOne({ user: userId, item: c.itemId })
      if(!inv || inv.qty < c.qty) return res.status(400).json({ error: 'Not enough ingredients' })
    }

    // success chance
    if(Math.random() > recipe.chance){
      return res.json({ success: false, message: 'The mixture fizzled and failed.' })
    }

    // consume ingredients
    for(const c of combo){
      const inv = await Inventory.findOne({ user: userId, item: c.itemId })
      inv.qty -= c.qty
      if(inv.qty <= 0) await inv.deleteOne()
      else await inv.save()
    }

    // give result potion
    let potionInv = await Inventory.findOne({ user: userId, item: recipe.resultItem._id })
    if(!potionInv) potionInv = new Inventory({ user: userId, item: recipe.resultItem._id, qty: 0 })
    potionInv.qty += 1
    await potionInv.save()

    // update user's discovered recipes and gold
    const user = await User.findById(userId)
    if(!user.discoveredRecipes.includes(recipe._id)) user.discoveredRecipes.push(recipe._id)
    user.gold += recipe.sellValue || 0
    await user.save()

    res.json({
      success: true,
      message: `You created ${recipe.resultItem.name}!`,
      potion: { id: recipe.resultItem._id, name: recipe.resultItem.name },
      gold: user.gold
    })
  }catch(err){
    console.error('craft', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/game/buy
router.post('/buy', authRequired, async (req, res) => {
  try{
    const userId = req.userId
    const { itemId, qty = 1 } = req.body
    const item = await Item.findById(itemId)
    if(!item) return res.status(400).json({ error: 'Item not found' })

    const user = await User.findById(userId)
    const cost = (item.basePrice || 1) * qty
    if(user.gold < cost) return res.status(400).json({ error: 'Not enough gold' })

    user.gold -= cost
    await user.save()

    let inv = await Inventory.findOne({ user: userId, item: itemId })
    if(!inv) inv = new Inventory({ user: userId, item: itemId, qty: 0 })
    inv.qty += qty
    await inv.save()

    res.json({ ok: true, gold: user.gold })
  }catch(err){
    console.error('buy', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/game/sell
router.post('/sell', authRequired, async (req, res) => {
  try{
    const userId = req.userId
    const { itemId, qty = 1 } = req.body
    const item = await Item.findById(itemId)
    if(!item) return res.status(400).json({ error: 'Item not found' })
    const inv = await Inventory.findOne({ user: userId, item: itemId })
    if(!inv || inv.qty < qty) return res.status(400).json({ error: 'Not enough to sell' })

    const user = await User.findById(userId)
    const gain = (item.basePrice || 1) * qty
    user.gold += gain
    await user.save()

    inv.qty -= qty
    if(inv.qty <= 0) await inv.deleteOne()
    else await inv.save()

    res.json({ ok: true, gold: user.gold })
  }catch(err){
    console.error('sell', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
