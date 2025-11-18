import mongoose from 'mongoose'
const { Schema, model } = mongoose

const RecipeSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  signature: { 
    type: String, 
    required: true, 
    unique: true 
  },
  resultItem: { 
    type: Schema.Types.ObjectId, 
    ref: 'Item', 
    required: true 
  },
  chance: { 
    type: Number, 
    default: 1,
    min: 0,
    max: 1
  },
  sellValue: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  notes: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true })

export default model('Recipe', RecipeSchema)