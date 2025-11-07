import React, { useEffect, useState } from 'react'
import api from '../api'

export default function RecipeBook() {
  const [recipes, setRecipes] = useState([])

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await api.get('/game/gamestate')
      setRecipes(res.data.discovered || [])
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen py-12 px-8 bg-gradient-to-b from-purple-900 to-black text-white">
      <h2 className="text-5xl font-bold text-purple-200 mb-10 text-center drop-shadow-lg">
        📜 Arcane Recipe Grimoire
      </h2>

      {recipes.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {recipes.map(r => (
            <div
              key={r._id}
              className="relative bg-gradient-to-b from-purple-200 to-purple-300 text-gray-900 border-4 border-purple-600 rounded-2xl shadow-xl p-6 hover:border-pink-400 hover:shadow-pink-400/50 transition-all duration-300"
            >
              {/* Magical corner glow */}
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_20px_4px_rgba(255,255,255,0.15)] pointer-events-none"></div>

              <h3 className="text-2xl font-extrabold text-purple-800 mb-3 tracking-wide">
                {r.name}
              </h3>

              {r.ingredients?.length ? (
                <ul className="mb-4 space-y-1 text-sm">
                  {r.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-purple-700 text-lg">✦</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm italic text-gray-700">Ingredients unknown...</p>
              )}

              <p className="text-gray-800 text-sm bg-purple-100 p-3 rounded-lg border border-purple-400 mt-3">
                {r.notes || "No description available"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-purple-200 text-xl">
          You haven't discovered any recipes yet...
        </p>
      )}
    </div>
  )
}
