import React, { useEffect, useState } from 'react';
import api from '../api';

export default function RecipeBook() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    setLoading(true);
    try {
      const res = await api.get('/game/gamestate');
      setRecipes(res.data.discovered || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="text-center text-lg mt-10 text-white">Loading your grimoire...</p>;
  }

  return (
    <div className="min-h-screen py-12 px-8 text-white">
      <h2 className="text-5xl font-bold text-purple-200 mb-10 text-center drop-shadow-lg">
        📜 Arcane Recipe Grimoire
      </h2>

      {recipes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {recipes.map(r => (
            <div
              key={r._id}
              className="bg-white/10 backdrop-blur-md border border-purple-400/40 rounded-xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-extrabold text-purple-200 mb-3 tracking-wide">
                Creates: {r.resultItem.name}
              </h3>

              {r.ingredients?.length > 0 ? (
                <div>
                  <p className="font-semibold mb-2 text-purple-300">Requires:</p>
                  <ul className="mb-4 space-y-1 text-sm">
                    {r.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-purple-400">✦</span>
                        {ing.item.name} (x{ing.quantity})
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">Ingredients unknown...</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-purple-300 text-xl">
          You haven't discovered any recipes yet. Experiment at the cauldron!
        </p>
      )}
    </div>
  );
}
