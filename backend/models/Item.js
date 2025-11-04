import mongoose from 'mongoose'
const { Schema, model } = mongoose

const ItemSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['ingredient','potion'], default: 'ingredient' },
  basePrice: { type: Number, default: 1 },
  description: { type: String, default: '' }
}, { timestamps: true })

export default model('Item', ItemSchema)
