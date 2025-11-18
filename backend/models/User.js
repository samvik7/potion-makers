import mongoose from 'mongoose'
const { Schema, model } = mongoose

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Player', 'Admin'], default: 'Player' },
  gold: { 
    type: Number, 
    default: 50,
    min: 0
  },
  discoveredRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true })

export default model('User', UserSchema)