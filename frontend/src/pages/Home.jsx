import React, { useEffect, useState } from 'react';
import api from '../api';
import Cauldron from '../components/Cauldron';
import { useAuth } from '../utils/authProvider';

export default function Home() {
  const { user } = useAuth();
  const [gameState, setGameState] = useState({ gold: 0, inventory: [], discovered: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchState();
  }, []);

  async function fetchState() {
    try {
      const res = await api.get('/game/gamestate');
      setGameState(res.data);
    } catch (e) {
      console.error('fetchState', e);
    } finally {
      setLoading(false);
    }
  }

  function onCraftResult() {
    fetchState();
  }

  if (loading) {
    return <div className="text-center text-lg mt-10 text-white">Loading your workshop...</div>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed text-white py-10 px-6"
      style={{ backgroundImage: "url('/images/backgrounds/home.jpg')" }}
    >
      <div className="bg-black/40 min-h-screen w-full fixed top-0 left-0 -z-10" />

      <h1 className="text-5xl font-bold text-center mb-6 drop-shadow-lg">
        🧪 Potion Makers — Cauldron
      </h1>

      <div className="max-w-3xl mx-auto mb-10 p-5 bg-white/10 backdrop-blur-md border border-purple-400/40 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between text-lg">
          <p><span className="font-semibold text-yellow-300">Gold: {gameState.gold} 🪙</span></p>
          <p><span className="font-semibold">Alchemist: {user?.username || "Guest"}</span></p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-start max-w-7xl mx-auto">
        
        <div className="w-full md:w-1/4 bg-white/10 backdrop-blur-lg border border-purple-400/40 rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-semibold mb-4 text-center">Your Ingredients</h3>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {gameState.inventory.length > 0 ? (
              gameState.inventory.map(invItem => (
                <li key={invItem.item._id} className="p-3 bg-purple-800/20 rounded-md flex justify-between items-center">
                  <span>{invItem.item.name}</span>
                  <span className="font-bold text-purple-200">x{invItem.quantity}</span>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400 mt-4">Your inventory is empty.</p>
            )}
          </ul>
        </div>

        <div className="w-full md:w-1/2 bg-white/10 backdrop-blur-lg border border-purple-400/40 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-semibold mb-4 text-center">⚗️ Craft Potions</h2>
          <Cauldron inventory={gameState.inventory} onCraftResult={onCraftResult} />
        </div>

        <div className="w-full md:w-1/4 bg-white/10 backdrop-blur-lg border border-purple-400/40 rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-semibold mb-4 text-center">Discovered Recipes</h3>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {gameState.discovered.length > 0 ? (
              gameState.discovered.map(recipe => (
                <li key={recipe._id} className="p-3 bg-purple-800/20 rounded-md">
                  <strong className="text-purple-200">{recipe.name}</strong>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400 mt-4">No recipes discovered yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
