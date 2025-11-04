import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

export function authRequired(req, res, next){
  try{
    const token = req.cookies?.token
    if(!token) return res.status(401).json({ error: 'Unauthorized' })
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.id
    req.userRole = payload.role
    next()
  }catch(err){
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function adminOnly(req, res, next){
  if(req.userRole !== 'admin') return res.status(403).json({ error: 'Admin only' })
  next()
}
