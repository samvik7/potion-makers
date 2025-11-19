import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../utils/authProvider';
import { useNavigate } from 'react-router-dom';
import ItemIcon from '../components/ItemIcon'; 

export default function AdminDashboard() {
  const { user, loading, showToast } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('items'); 

  const [form, setForm] = useState({ name: '', type: 'Ingredient', basePrice: 10, description: '' });

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'Admin') {
        showToast("You are not authorized to view this page.", "error");
        navigate('/');
      } else {
        loadAllData();
      }
    }
  }, [user, loading, navigate]);

  async function loadAllData() {
    try {
      const [itemsRes, usersRes] = await Promise.all([
        api.get('/admin/items'),
        api.get('/admin/users')
      ]);
      setItems(itemsRes.data);
      setUsers(usersRes.data);
    } catch (e) {
      console.error(e);
      showToast("Failed to load admin data", "error");
    }
  }

  async function handleCreateItem(e) {
    e.preventDefault();
    try {
      await api.post('/admin/items', form);
      showToast("Item created successfully", "success");
      setForm({ name: '', type: 'Ingredient', basePrice: 10, description: '' }); // Reset form
      loadAllData();
    } catch (e) {
      showToast(e.response?.data?.error || "Failed to create item", "error");
    }
  }

  async function handleDeleteItem(id) {
    if (!window.confirm("Are you sure? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/items/${id}`);
      showToast("Item deleted", "success");
      loadAllData();
    } catch (e) {
      showToast("Failed to delete item", "error");
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("BAN USER: Are you sure? This will delete their account and all progress.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showToast("User banned/deleted", "success");
      loadAllData();
    } catch (e) {
      showToast("Failed to delete user", "error");
    }
  }

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-red-400 mb-8 border-b border-red-500/30 pb-4 flex items-center gap-3">
          🛡️ Admin Dashboard
        </h1>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('items')}
            className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'items' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Manage Items
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'users' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Manage Players
          </button>
        </div>

        {activeTab === 'items' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-black/30 p-6 rounded-xl border border-gray-600 h-fit">
              <h3 className="text-xl font-semibold mb-4 text-red-200">Create New Item</h3>
              <form onSubmit={handleCreateItem} className="space-y-4">
                <input 
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-red-500 outline-none" 
                  placeholder="Item Name" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  required 
                />
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="p-2 rounded bg-gray-800 border border-gray-600 focus:border-red-500 outline-none"
                    value={form.type}
                    onChange={e => setForm({...form, type: e.target.value})}
                  >
                    <option value="Ingredient">Ingredient</option>
                    <option value="Potion">Potion</option>
                  </select>
                  <input 
                    type="number"
                    className="p-2 rounded bg-gray-800 border border-gray-600 focus:border-red-500 outline-none" 
                    placeholder="Price" 
                    value={form.basePrice} 
                    onChange={e => setForm({...form, basePrice: e.target.value})} 
                    required 
                  />
                </div>
                <textarea 
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-red-500 outline-none" 
                  placeholder="Description" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition">
                  Add to Database
                </button>
              </form>
            </div>

            <div className="md:col-span-2 space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item._id} className="flex justify-between items-center bg-gray-800/50 p-3 rounded border border-gray-700 hover:border-red-500/50 transition">
                  <div className="flex items-center gap-3">
                    <ItemIcon name={item.name} size="w-10 h-10" />
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{item.type} • {item.basePrice} Gold</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteItem(item._id)}
                    className="px-3 py-1 bg-red-900/30 text-red-400 border border-red-900 hover:bg-red-600 hover:text-white rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-black/30 p-6 rounded-xl border border-gray-600">
            <h3 className="text-xl font-semibold mb-6 text-red-200">Registered Players ({users.length})</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700 text-sm uppercase">
                  <th className="py-2">Username</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Gold</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 font-bold">{u.username}</td>
                    <td className={`py-3 ${u.role === 'Admin' ? 'text-red-400 font-bold' : 'text-gray-300'}`}>{u.role}</td>
                    <td className="py-3 text-yellow-500">{u.gold}</td>
                    <td className="py-3 text-right">
                      {u.role !== 'Admin' && (
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-red-500 hover:text-white hover:bg-red-600 px-3 py-1 rounded text-xs border border-red-900/50 transition"
                        >
                          Ban User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}