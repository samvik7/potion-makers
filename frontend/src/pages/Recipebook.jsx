import React, { useEffect, useState } from 'react';
import api from '../api';

export default function RecipeBook() {
  const [recipes, setRecipes] = useState([]);
  const [itemMap, setItemMap] = useState({}); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [gameStateRes, allItemsRes] = await Promise.all([
        api.get('/game/gamestate'),
        api.get('/game/shop-items')
      ]);

      setRecipes(gameStateRes.data.discovered || []);

      const map = {};
      allItemsRes.data.forEach(item => {
        map[item._id] = item.name;
      });
      setItemMap(map);

    } catch (e) {
      console.error("Error loading recipe book:", e);
    } finally {
      setLoading(false);
    }
  }

  function parseIngredients(signature) {
    if (!signature) return [];
    
    return signature.split('|').map(pair => {
      const [id, qty] = pair.split(':'); 
      return {
        name: itemMap[id] || 'Mystery Ingredient', 
        qty: qty
      };
    });
  }

  if (loading) {
    return <p className="text-center text-lg mt-10 text-white">Loading your grimoire...</p>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed text-white py-12 px-8"
      style={{ backgroundImage: "url('/images/backgrounds/recipe.jpg')" }}
    >
      <div className="bg-black/40 min-h-screen w-full fixed top-0 left-0 -z-10" />

      <h2 className="text-5xl font-bold text-purple-200 mb-10 text-center drop-shadow-lg">
        📜 Arcane Recipe Grimoire
      </h2>

      {recipes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {recipes.map(r => {
            const ingredients = parseIngredients(r.signature);

            return (
              <div
                key={r._id}
                className="bg-white/10 backdrop-blur-md border border-purple-400/40 rounded-xl shadow-lg p-6 hover:border-purple-300 transition"
              >
                <h3 className="text-2xl font-extrabold text-yellow-300 mb-4 tracking-wide border-b border-white/10 pb-2">
                  {r.name}
                </h3>

                <div className="space-y-2">
                  <p className="text-sm text-purple-200 font-semibold uppercase tracking-wider">Requires:</p>
                  <ul className="space-y-1 text-gray-200">
                    {ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 bg-black/20 px-3 py-2 rounded-md">
                        <span className="text-purple-400">✦</span>
                        <span className="flex-1">{ing.name}</span>
                        <span className="font-bold text-purple-300">x{ing.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm italic text-gray-400 mt-4 border-t border-white/10 pt-3">
                  {r.notes || "A powerful concoction."}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-purple-200 text-2xl font-bold mb-2">The Grimoire is Empty</p>
          <p className="text-purple-200 text-lg">
            Visit the Cauldron to experiment and discover new recipes!
          </p>
        </div>
      )}
    </div>
  );
}