import React, { useState } from 'react'
import api from '../api'


export default function Cauldron({ inventory = [], onCraftResult }){
const [selected, setSelected] = useState({})
const [message, setMessage] = useState('')


function addOne(itemId){
setSelected(prev => {
const next = {...prev}
next[itemId] = (next[itemId] || 0) + 1
const owned = (inventory.find(i=>i.item._id===itemId)?.qty) || (inventory.find(i=>i.itemId===itemId)?.qty) || 0
if(next[itemId] > owned) next[itemId] = owned
return next
})
}


function removeOne(itemId){
setSelected(prev => {
const next = {...prev}
if(!next[itemId]) return prev
next[itemId] = next[itemId] - 1
if(next[itemId] <= 0) delete next[itemId]
return next
})
}


async function craft(){
const combo = Object.entries(selected).map(([itemId, qty])=>({ itemId, qty }))
if(!combo.length){ setMessage('Select some ingredients first'); return }
try{
const res = await api.post('/game/craft', { combo })
setMessage(res.data.message || 'Craft result')
onCraftResult && onCraftResult(res.data)
setSelected({})
}catch(err){
setMessage(err?.response?.data?.error || 'Craft error')
}
}


return (
<div className="cauldron-glow max-w-4xl mx-auto mt-10 p-8 rounded-2xl bg-white/10 backdrop-blur border border-purple-400 shadow-xl">

  <h2 className="text-center text-4xl font-extrabold text-purple-300 tracking-wide mb-6">
    🔮 The Cauldron
  </h2>

  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
    {inventory.map(inv => (
      <div key={inv._id || inv.item._id}
        className="bg-purple-900/40 border border-purple-500 rounded-xl p-4 text-white shadow-md hover:shadow-purple-400 transition">
        
        <div className="text-lg font-bold">{inv.item.name}</div>
        <div className="text-sm opacity-80">Qty: {inv.qty}</div>

        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={()=>removeOne(inv.item._id)}
            className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white"
          >-</button>

          <span className="text-xl font-semibold">{selected[inv.item._id] || 0}</span>

          <button
            onClick={()=>addOne(inv.item._id)}
            className="px-3 py-1 rounded-lg bg-purple-700 hover:bg-purple-600 text-white"
          >+</button>
        </div>
      </div>
    ))}
  </div>

  <div className="flex justify-center mt-8">
    <button
      onClick={craft}
      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 
      text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-purple-400 transition-all">
      🧪 Attempt Craft
    </button>
  </div>

  {message && (
    <div className="text-center text-purple-200 mt-6 text-lg italic animate-pulse">
      {message}
    </div>
  )}
</div>

)
}