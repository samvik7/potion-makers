// src/utils/authProvider.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api"; // Make sure api.js exists in src/

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch session from backend (optional)
    async function fetchSession() {
      try {
        const res = await api.get("/auth/session");
        setUser(res.data.user || null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
