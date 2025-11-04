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
<div className="cauldron">
<h2>Cauldron</h2>
<div className="inventory-grid">
{inventory.map(inv => (
<div key={inv._id || inv.item._id} className="inv-item">
<div>{inv.item.name}</div>
<div>Qty: {inv.qty}</div>
<div className="sel-controls">
<button onClick={()=>removeOne(inv.item._id)}>-</button>
<span>{selected[inv.item._id]||0}</span>
<button onClick={()=>addOne(inv.item._id)}>+</button>
</div>
</div>
))}
</div>
<div style={{marginTop:10}}>
<button onClick={craft}>Attempt Craft</button>
</div>
<div className="message">{message}</div>
</div>
)
}