import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Inventory from "./pages/Inventory";
import RecipeBook from "./pages/Recipebook"; 
import AuthPages from "./pages/AuthPages";
import Header from "./components/Header";
import Rankings from "./pages/Rankings";
import AdminDashboard from "./pages/AdminDashboard"; 
import { AuthProvider } from "./utils/authProvider";
import ProtectedRoute from "./components/ProtectedRoute"; 

export default function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/auth/*" element={<AuthPages />} />

            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/recipes" element={<ProtectedRoute><RecipeBook /></ProtectedRoute>} />
            <Route path="/rankings" element={<ProtectedRoute><Rankings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}