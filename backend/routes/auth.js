import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User.js'
import Inventory from '../models/Inventory.js'
import Item from '../models/Item.js'

dotenv.config()
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
const TOKEN_EXPIRES = 60 * 60 * 24 * 7 // 7 days

function createToken(user){
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({ error: 'username and password required' })
    const existing = await User.findOne({ username })
    if(existing) return res.status(400).json({ error: 'username taken' })

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ username, passwordHash: hash })

    // Optional: give starter items if items exist (Water, Herb) - attempt to find them
    const water = await Item.findOne({ name: 'Water' })
    const herb = await Item.findOne({ name: 'Herb' })
    if(water) await Inventory.create({ user: user._id, item: water._id, qty: 3 }).catch(()=>{})
    if(herb) await Inventory.create({ user: user._id, item: herb._id, qty: 2 }).catch(()=>{})

    const token = createToken(user)
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
    const safeUser = { id: user._id, username: user.username, role: user.role, gold: user.gold }
    res.json({ user: safeUser })
  }catch(err){
    console.error('register', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if(!user) return res.status(400).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' })
    const token = createToken(user)
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })
    const safeUser = { id: user._id, username: user.username, role: user.role, gold: user.gold }
    res.json({ user: safeUser })
  }catch(err){
    console.error('login', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/auth/session
router.get('/session', async (req, res) => {
  try{
    const token = req.cookies?.token
    if(!token) return res.json({ user: null })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if(!user) return res.json({ user: null })
    const safeUser = { id: user._id, username: user.username, role: user.role, gold: user.gold }
    res.json({ user: safeUser })
  }catch(err){
    return res.json({ user: null })
  }
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ ok: true })
})

export default router
