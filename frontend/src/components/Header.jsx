import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../utils/authProvider';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-purple-800 text-white px-6 py-4 shadow-md flex items-center">
      
      <Link to="/" className="text-2xl font-bold tracking-wide hover:text-purple-200 transition">
        🧪 Potion Makers
      </Link>

      <nav className="flex gap-6 text-lg ml-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive 
              ? "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1" 
              : "hover:text-purple-200 transition"
          }
        >
          Home
        </NavLink>

        <NavLink 
          to="/shop" 
          className={({ isActive }) => 
            isActive 
              ? "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1" 
              : "hover:text-purple-200 transition"
          }
        >
          Shop
        </NavLink>

        <NavLink 
          to="/inventory" 
          className={({ isActive }) => 
            isActive 
              ? "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1" 
              : "hover:text-purple-200 transition"
          }
        >
          Inventory
        </NavLink>

        <NavLink 
         to="/rankings"
         className={({ isActive }) =>
           isActive
           ? "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1"
           : "hover:text-purple-200 transition"
          }
        >
          Rankings
        </NavLink>

        <NavLink 
          to="/recipes" 
          className={({ isActive }) => 
            isActive 
              ? "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1" 
              : "hover:text-purple-200 transition"
          }
        >
          Recipe Book
        </NavLink>  

        {/*ADMIN LINK (Only visible if user is Admin)*/}
        {user?.role === 'Admin' && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => 
              isActive 
                ? "text-red-400 font-bold border-b-2 border-red-400 pb-1" 
                : "text-red-300 hover:text-red-200 transition"
            }
          >
            Admin Panel
          </NavLink>
        )}

      </nav>

      <div className="ml-auto">
        {user ? (
          <div className="flex items-center gap-6 text-lg">
            <span className="font-semibold text-yellow-300">💰 {user.gold}</span>
            <span className="font-semibold">👤 {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition text-base"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="px-4 py-2 rounded-md font-semibold transition text-lg
                       bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-purple-500/50"
          >
            Login
          </Link>
        )}    
      </div>
    </header>
  );
}
