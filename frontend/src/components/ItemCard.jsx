import React from 'react'


export default function ItemCard({ item, onAction, actionText }){
return (
<div className="card">
<div className="card-title">{item.name}</div>
<div className="card-body">
<p>{item.description || 'No description'}</p>
{item.qty !== undefined && <p>Qty: {item.qty}</p>}
{item.basePrice !== undefined && <p>Price: {item.basePrice}g</p>}
<button onClick={onAction}>{actionText || 'Action'}</button>
</div>
</div>
)
}