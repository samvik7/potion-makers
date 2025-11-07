import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../utils/authProvider'

export default function Header() {
  const { user, logout } = useAuth()

  return (
<header className="bg-purple-800 text-white px-6 py-4 shadow-md flex items-center">
  
  {/* Logo / Title */}
  <Link to="/" className="text-2xl font-bold tracking-wide hover:text-purple-200 transition">
    🧪 Potion Makers
  </Link>

  {/* Navigation - moved closer to logo */}
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
    to="/recipes" 
    className={({ isActive }) => 
      isActive 
        ? "text-yellow-300 font-bold border-b-2 border-yellow-300 pb-1" 
        : "hover:text-purple-200 transition"
    }
  >
    Recipe Book
  </NavLink>
  </nav>

  {/* Push user controls to the right */}
  <div className="ml-auto">
    {user ? (
      <div className="flex items-center gap-4">
        <span className="font-semibold">👤 {user.username}</span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md font-semibold transition"
        >
          Logout
        </button>
      </div>
    ) : (
      <Link
          to="/auth/login"
  className="px-3 py-2 rounded-md font-semibold transition
             bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-purple-500/50"
>
        Login
      </Link>
    )}
  </div>
</header>
  )
}
