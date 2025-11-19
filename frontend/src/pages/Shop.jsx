import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../utils/authProvider';
import ItemIcon from '../components/ItemIcon';

export default function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchUser, showToast } = useAuth();

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await api.get('/game/shop-items');
      setItems(res.data);
    } catch (e) {
      console.error("Failed to load shop items:", e);
    } finally {
      setLoading(false);
    }
  }

  async function buy(itemId) {
    try {
      await api.post('/game/buy', { itemId, qty: 1 });
      fetchUser();
      showToast("Item purchased successfully!", "success");
    } catch (e) {
      showToast(e.response?.data?.error || 'Purchase failed', "error");
    }
  }

  if (loading) {
    return <p className="text-center text-lg mt-10 text-white">Loading shop...</p>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed text-white py-10 px-6"
      style={{ backgroundImage: "url('/images/backgrounds/shop.jpg')" }}
    >
      <div className="bg-black/40 min-h-screen w-full fixed top-0 left-0 -z-10" />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-5xl font-extrabold text-purple-300 mb-10 drop-shadow-lg">
          🛒 Arcane Shop
        </h1>

        {items.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(it => (
              <div key={it._id}
                className="p-5 bg-white/10 backdrop-blur-md border border-purple-400/40 rounded-xl shadow-lg hover:shadow-purple-400/50 transition flex flex-col justify-between text-white">
                
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-2 bg-purple-900/30 rounded-full shadow-inner">
                     <ItemIcon name={it.name} image={it.image} size="w-16 h-16" />
                  </div>

                  <h3 className="text-2xl font-bold text-purple-200">{it.name}</h3>
                  <p className="text-purple-300 text-sm mt-1">{it.description || "No description"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-lg font-semibold text-yellow-300 mb-3 text-center">
                    💰 {it.basePrice} Gold
                  </p>
                  <button
                    onClick={() => buy(it._id)}
                    className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition">
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center text-lg">The shop is currently empty.</p>
        )}
      </div>
    </div>
  );
}
