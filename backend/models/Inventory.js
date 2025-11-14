import mongoose from 'mongoose'
const { Schema, model } = mongoose

const InventorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, default: 0 }
}, { timestamps: true })

InventorySchema.index({ user: 1, item: 1 }, { unique: true })

export default model('Inventory', InventorySchema)
