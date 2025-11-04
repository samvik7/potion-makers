import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Item from './models/Item.js'
import Recipe from './models/Recipe.js'
import User from './models/User.js'
import Inventory from './models/Inventory.js'

dotenv.config()

async function seed(){
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  console.log('Connected to DB for seeding')

  // clear or skip if exists
  console.log('Creating items...')
  const itemsData = [
    { name: 'Water', type: 'ingredient', basePrice: 1, description: 'Basic liquid' },
    { name: 'Herb', type: 'ingredient', basePrice: 2, description: 'Common plant' },
    { name: 'Glow Dust', type: 'ingredient', basePrice: 5, description: 'Magical dust' },
    { name: 'Healing Potion', type: 'potion', basePrice: 10, description: 'Restores HP' },
    { name: 'Mana Potion', type: 'potion', basePrice: 12, description: 'Restores MP' }
  ]

  // upsert items to avoid duplicates
  const created = []
  for(const d of itemsData){
    let it = await Item.findOne({ name: d.name })
    if(!it) it = await Item.create(d)
    created.push(it)
  }

  // map names to ids
  const byName = {}
  created.forEach(i => byName[i.name] = i)

  console.log('Creating recipes...')
  const recipesData = [
    {
      name: 'Simple Healing Potion',
      combo: [
        { itemId: byName['Water']._id.toString(), qty: 1 },
        { itemId: byName['Herb']._id.toString(), qty: 2 }
      ],
      result: byName['Healing Potion']._id,
      chance: 0.95,
      sellValue: 5,
      notes: 'Common beginner healing potion'
    },
    {
      name: 'Mana Elixir',
      combo: [
        { itemId: byName['Water']._id.toString(), qty: 1 },
        { itemId: byName['Glow Dust']._id.toString(), qty: 1 }
      ],
      result: byName['Mana Potion']._id,
      chance: 0.85,
      sellValue: 6,
      notes: 'Restores magical energy'
    }
  ]

  for(const r of recipesData){
    const signature = r.combo.map(c=>`${c.itemId}:${c.qty}`).sort().join('|')
    let exists = await Recipe.findOne({ signature })
    if(!exists){
      await Recipe.create({
        name: r.name,
        signature,
        resultItem: r.result,
        chance: r.chance,
        sellValue: r.sellValue,
        notes: r.notes
      })
    }
  }

  // create an admin user for convenience
  const adminUser = await User.findOne({ username: 'admin' })
  if(!adminUser){
    const bcrypt = await import('bcrypt')
    const hash = await bcrypt.hash('adminpass', 10)
    const admin = await User.create({ username: 'admin', passwordHash: hash, role: 'admin', gold: 999 })
    console.log('Created admin / adminpass')
    // give admin some inventory
    await Inventory.create({ user: admin._id, item: byName['Water']._id, qty: 10 }).catch(()=>{})
    await Inventory.create({ user: admin._id, item: byName['Herb']._id, qty: 10 }).catch(()=>{})
  }

  console.log('Seeding complete.')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Item from './models/Item.js'
import Recipe from './models/Recipe.js'
import User from './models/User.js'
import Inventory from './models/Inventory.js'

dotenv.config()

async function seed(){
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  console.log('Connected to DB for seeding')

  // clear or skip if exists
  console.log('Creating items...')
  const itemsData = [
    { name: 'Water', type: 'ingredient', basePrice: 1, description: 'Basic liquid' },
    { name: 'Herb', type: 'ingredient', basePrice: 2, description: 'Common plant' },
    { name: 'Glow Dust', type: 'ingredient', basePrice: 5, description: 'Magical dust' },
    { name: 'Healing Potion', type: 'potion', basePrice: 10, description: 'Restores HP' },
    { name: 'Mana Potion', type: 'potion', basePrice: 12, description: 'Restores MP' }
  ]

  // upsert items to avoid duplicates
  const created = []
  for(const d of itemsData){
    let it = await Item.findOne({ name: d.name })
    if(!it) it = await Item.create(d)
    created.push(it)
  }

  // map names to ids
  const byName = {}
  created.forEach(i => byName[i.name] = i)

  console.log('Creating recipes...')
  const recipesData = [
    {
      name: 'Simple Healing Potion',
      combo: [
        { itemId: byName['Water']._id.toString(), qty: 1 },
        { itemId: byName['Herb']._id.toString(), qty: 2 }
      ],
      result: byName['Healing Potion']._id,
      chance: 0.95,
      sellValue: 5,
      notes: 'Common beginner healing potion'
    },
    {
      name: 'Mana Elixir',
      combo: [
        { itemId: byName['Water']._id.toString(), qty: 1 },
        { itemId: byName['Glow Dust']._id.toString(), qty: 1 }
      ],
      result: byName['Mana Potion']._id,
      chance: 0.85,
      sellValue: 6,
      notes: 'Restores magical energy'
    }
  ]

  for(const r of recipesData){
    const signature = r.combo.map(c=>`${c.itemId}:${c.qty}`).sort().join('|')
    let exists = await Recipe.findOne({ signature })
    if(!exists){
      await Recipe.create({
        name: r.name,
        signature,
        resultItem: r.result,
        chance: r.chance,
        sellValue: r.sellValue,
        notes: r.notes
      })
    }
  }

  // create an admin user for convenience
  const adminUser = await User.findOne({ username: 'admin' })
  if(!adminUser){
    const bcrypt = await import('bcrypt')
    const hash = await bcrypt.hash('adminpass', 10)
    const admin = await User.create({ username: 'admin', passwordHash: hash, role: 'admin', gold: 999 })
    console.log('Created admin / adminpass')
    // give admin some inventory
    await Inventory.create({ user: admin._id, item: byName['Water']._id, qty: 10 }).catch(()=>{})
    await Inventory.create({ user: admin._id, item: byName['Herb']._id, qty: 10 }).catch(()=>{})
  }

  console.log('Seeding complete.')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
