import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Rankings() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);

  async function fetchRankings() {
    try {
      const res = await api.get('/game/rankings');
      setPlayers(res.data);
    } catch (e) {
      console.error('rankings error', e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-center mt-10 text-xl">Loading rankings...</div>;

  return (
    <div className="min-h-screen text-white p-8">
      <h1 className="text-5xl font-bold text-center mb-8">🏆 Player Rankings</h1>

      <div className="max-w-3xl mx-auto bg-white/10 p-6 rounded-2xl border border-purple-400/40 shadow-lg">
        <table className="w-full text-left">
          <thead>
            <tr className="text-yellow-300 text-xl border-b border-purple-500">
              <th className="py-2">Rank</th>
              <th>Player</th>
              <th>Gold</th>
            </tr>
          </thead>

          <tbody>
            {players.map((p, index) => (
              <tr key={p._id} className="border-b border-purple-700/40">
                <td className="py-2 font-bold text-purple-200">{index + 1}</td>
                <td className="font-semibold">{p.username}</td>
                <td className="font-semibold text-yellow-300">{p.gold} 🪙</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
