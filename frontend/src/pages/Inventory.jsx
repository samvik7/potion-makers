import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../utils/authProvider';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchUser, showToast } = useAuth();

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const res = await api.get('/game/gamestate');
      setInventory(res.data.inventory || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function sell(inventoryItem) {
    try {
      await api.post('/game/sell', { itemId: inventoryItem.item._id, qty: 1 });
      fetchUser();
      loadInventory();
      showToast("Item sold successfully!", "success");
    } catch (e) {
      showToast(e.response?.data?.error || "Sell failed", "error");
    }
  }

  if (loading) {
    return <div className="text-center text-lg mt-10 text-white">Loading your inventory...</div>;
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed text-white py-10 px-6"
      style={{ backgroundImage: "url('/images/backgrounds/inventory.jpg')" }}
    >
      <div className="bg-black/40 min-h-screen w-full fixed top-0 left-0 -z-10" />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-5xl font-extrabold text-purple-300 mb-10 drop-shadow-lg">
          🎒 Your Inventory
        </h1>

        {inventory.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {inventory.map(invItem => (
              <div
                key={invItem._id}
                className="p-5 bg-white/10 backdrop-blur-md border border-purple-400/40 rounded-xl shadow-lg hover:shadow-purple-400/50 transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-purple-200">{invItem.item.name}</h3>
                  <p className="text-purple-300 text-sm mt-1">{invItem.item.description || "No description"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-lg font-semibold text-yellow-300 mb-3">
                    Owned: {invItem.quantity}
                  </p>

                  <button
                    onClick={() => sell(invItem)}
                    className="w-full py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-bold shadow-md transition"
                  >
                    Sell for {invItem.item.basePrice} Gold
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center text-lg">
            You have nothing in your inventory. Visit the shop to get started!
          </p>
        )}
      </div>
    </div>
  );
}