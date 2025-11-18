import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import Toast from "../components/Toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/session");
      setUser(res.data.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  }, [loading]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      throw new Error(err.response?.data?.error || "Login failed");
    }
  };

  const register = async (username, password) => {
    try {
      const res = await api.post("/auth/register", { username, password });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      throw new Error(err.response?.data?.error || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
    }
  };

  const value = { user, login, logout, register, loading, fetchUser, showToast };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        onDone={() => setToast({ message: '', type: 'success' })}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
