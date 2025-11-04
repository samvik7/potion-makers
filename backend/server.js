import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import gameRoutes from './routes/game.js'
import adminRoutes from './routes/admin.js'

dotenv.config()
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}))

// routes
app.use('/api/auth', authRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/admin', adminRoutes)

// health
app.get('/', (req, res) => res.json({ ok: true }))

// connect db and start
async function start(){
  try{
    await mongoose.connect(MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
    console.log('Connected to MongoDB')
    app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`))
  }catch(err){
    console.error('Failed to start', err)
  }
}

start()
