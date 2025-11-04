import React, { useEffect, useState } from 'react'
import api from '../api'
import ItemCard from '../components/ItemCard'


export default function Inventory(){
const [inventory, setInventory] = useState([])


useEffect(()=>{ load() }, [])
async function load(){
try{ const res = await api.get('/game/gamestate'); setInventory(res.data.inventory || []) }catch(e){ console.error(e) }
}


async function sell(inv){
try{ await api.post('/game/sell', { itemId: inv.item._id, qty: 1 }); alert('Sold') ; load() }catch(e){ alert('Sell failed') }
}


return (
<div>
<h1>Your Inventory</h1>
<div className="grid">
{inventory.map(inv => (
<ItemCard key={inv._id} item={{...inv.item, qty: inv.qty}} onAction={()=>sell(inv)} actionText={`Sell`}/>
))}
</div>
</div>
)
}