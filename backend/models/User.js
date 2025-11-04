import mongoose from 'mongoose'
const { Schema, model } = mongoose

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['player','admin'], default: 'player' },
  gold: { type: Number, default: 50 },
  discoveredRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true })

export default model('User', UserSchema)
