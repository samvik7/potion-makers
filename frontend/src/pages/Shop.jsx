import React, { useEffect, useState } from 'react'
import api from '../api'
import ItemCard from '../components/ItemCard'


export default function Shop(){
const [items, setItems] = useState([])


useEffect(()=>{ load() }, [])
async function load(){
try{ const res = await api.get('/admin/items'); setItems(res.data) }catch(e){ console.error(e) }
}


async function buy(itemId){
try{ await api.post('/game/buy', { itemId, qty:1 }); alert('Bought!'); load() }catch(e){ alert('Buy failed') }
}


return (
<div>
<h1>Shop</h1>
<div className="grid">
{items.map(it => (
<ItemCard key={it._id} item={it} onAction={()=>buy(it._id)} actionText={`Buy (${it.basePrice}g)`}/>
))}
</div>
</div>
)
}