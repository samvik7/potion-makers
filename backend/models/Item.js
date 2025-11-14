import mongoose from 'mongoose'
const { Schema, model } = mongoose

const ItemSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    // Ensures no two items can have the same name.
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
    // Ensures an item's price can't be a negative number.
    min: 0 
  },
  description: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true })

export default model('Item', ItemSchema)