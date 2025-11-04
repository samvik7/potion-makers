import React, { useEffect, useState } from 'react'
import api from '../api'


export default function RecipeBook(){
const [recipes, setRecipes] = useState([])
useEffect(()=>{ load() }, [])
async function load(){
try{ const res = await api.get('/game/gamestate'); setRecipes(res.data.discovered || []) }catch(e){ console.error(e) }
}


return (
<div>
<h1>Recipe Book</h1>
{recipes.length ? (
<ul>
{recipes.map(r => (
<li key={r._id}><strong>{r.name}</strong> — {r.notes || 'No description'}</li>
))}
</ul>
) : <p>You haven't discovered any recipes yet.</p>}
</div>
)
}