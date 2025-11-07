import React, { useEffect, useState } from 'react'
import api from '../api'
import Cauldron from '../components/Cauldron'
import { useAuth } from '../utils/authProvider'

export default function Home(){
  const { user } = useAuth()
  const [gameState, setGameState] = useState({ gold:0, inventory:[], discovered:[] })

  useEffect(() => { fetchState() }, [])

  async function fetchState(){
    try{
      const res = await api.get('/game/gamestate')
      setGameState(res.data)
    }catch(e){
      console.error('fetchState', e)
    }
  }

  function onCraftResult(){
    fetchState()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900 text-white py-10 px-6">
      
      {/* Title */}
      <h1 className="text-5xl font-bold text-center mb-6 drop-shadow-lg">
        🧪 Potion Makers — Cauldron
      </h1>

      {/* Player Stats */}
      <div className="max-w-3xl mx-auto mb-10 p-5 bg-white/10 backdrop-blur-md border border-purple-400/40 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between text-lg">
          <p><span className="font-semibold">Gold:</span> {gameState.gold} 🪙</p>
          <p><span className="font-semibold">Alchemist:</span> {user?.username || "Guest"}</p>
        </div>
      </div>

      {/* Cauldron Section */}
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-purple-400/40 rounded-2xl shadow-xl p-8 mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">⚗️ Craft Potions</h2>
      <div className="flex flex-col items-center mt-10">
  <div className="cauldron-glow">
    <Cauldron inventory={gameState.inventory} onCraftResult={onCraftResult} />
  </div>
</div>

      </div>

      {/* Discovered Recipes */}
      <section className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-semibold mb-4 text-center">📜 Discovered Recipes</h3>

        {gameState.discovered?.length ? (
          <ul className="grid md:grid-cols-2 gap-4">
            {gameState.discovered.map(r => (
              <li key={r._id} className="p-4 bg-purple-800/30 border border-purple-500 rounded-xl shadow hover:shadow-lg transition">
                <strong className="text-purple-200">{r.name}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-300 text-lg">No recipes discovered yet...</p>
        )}
      </section>

    </div>
  )
}
