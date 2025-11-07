import React, { useEffect, useState } from 'react' 
import api from '../api'

export default function Inventory(){
  const [inventory, setInventory] = useState([])

  useEffect(() => { load() }, [])

  async function load(){
    try {
      const res = await api.get('/game/gamestate')
      setInventory(res.data.inventory || [])
    } catch(e){
      console.error(e)
    }
  }

  async function sell(inv){
    try {
      await api.post('/game/sell', { itemId: inv.item._id, qty: 1 })
      load()
      alert("💰 Item sold!")
    } catch(e){
      alert("❌ Sell failed.")
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-5xl font-extrabold text-green-700 text-center mb-10">
        🎒 Inventory
      </h1>

      {inventory.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inventory.map(inv => (
            <div 
              key={inv._id}
              className="p-6 bg-white rounded-2xl border-2 border-green-300 shadow-md hover:shadow-xl hover:-translate-y-1 transition"
            >
              <h2 className="text-2xl font-bold text-green-800 mb-2">{inv.item.name}</h2>
              <p className="text-gray-700 mb-3">Quantity: {inv.qty}</p>

              <button 
                onClick={() => sell(inv)}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
              >
                Sell
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">
          Nothing in your inventory yet...
        </p>
      )}
    </div>
  )
}
