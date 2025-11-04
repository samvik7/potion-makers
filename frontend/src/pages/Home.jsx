import React, { useEffect, useState } from 'react'
import api from '../api'
import Cauldron from '../components/Cauldron'
import { useAuth } from '../utils/authProvider'


export default function Home(){
const { user } = useAuth()
const [gameState, setGameState] = useState({ gold:0, inventory:[], discovered:[] })


useEffect(()=>{ fetchState() }, [])


async function fetchState(){
try{
const res = await api.get('/game/gamestate')
setGameState(res.data)
}catch(e){
console.error('fetchState', e)
}
}


function onCraftResult(result){
// after crafting update gamestate
fetchState()
}


return (
<div>
<h1>Potion Makers — Cauldron</h1>
<div className="panel">
<div><strong>Gold:</strong> {gameState.gold}</div>
<div><strong>User:</strong> {user?.username || 'Guest'}</div>
</div>


<Cauldron inventory={gameState.inventory} onCraftResult={onCraftResult} />


<section style={{marginTop:20}}>
<h3>Discovered Recipes</h3>
{gameState.discovered?.length ? (
<ul>
{gameState.discovered.map(r => <li key={r._id}>{r.name}</li>)}
</ul>
) : <p>None discovered yet.</p>}
</section>
</div>
)
}