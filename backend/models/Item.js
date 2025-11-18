import mongoose from 'mongoose'
const { Schema, model } = mongoose

const ItemSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  type: { 
    type: String, 
    enum: ['Ingredient', 'Potion'], 
    default: 'Ingredient' 
  },
  basePrice: { 
    type: Number, 
    default: 1,
    min: 0 
  },
  description: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true })

export default model('Item', ItemSchema)