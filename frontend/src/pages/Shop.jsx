import React, { useEffect, useState } from 'react'
import api from '../api'
import ItemCard from '../components/ItemCard'

export default function Shop(){
  const [items, setItems] = useState([])

  useEffect(()=>{ load() }, [])

  async function load(){
    try{ 
      const res = await api.get('/admin/items')
      setItems(res.data)
    } catch(e){ console.error(e) }
  }

  async function buy(itemId){
    try{ 
      await api.post('/game/buy', { itemId, qty:1 }) 
      alert('Purchased!')
      load()
    } catch(e){ 
      alert('Purchase failed')
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">

      <h1 className="text-center text-5xl font-extrabold text-purple-700 mb-10">
        🛒 Arcane Shop
      </h1>

      {items.length ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(it => (
            <div key={it._id}
              className="p-5 bg-white border-2 border-purple-400 rounded-xl shadow-md hover:shadow-purple-500 transition flex flex-col justify-between">

              <div>
                <h3 className="text-2xl font-bold text-purple-800">{it.name}</h3>
                <p className="text-gray-700 text-sm mt-1">{it.description || "No description"}</p>
              </div>

              <div className="mt-4">
                <p className="text-lg font-semibold text-green-700 mb-3">
                  💰 {it.basePrice} Gold
                </p>

                <button
                  onClick={()=>buy(it._id)}
                  className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition">
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-lg">The shop is empty...</p>
      )}

    </div>
  )
}
