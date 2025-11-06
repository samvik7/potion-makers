import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Inventory from "./pages/Inventory";
import RecipeBook from "./pages/Recipebook";
import AuthPages from "./pages/AuthPages";
import Header from "./components/Header";
import { AuthProvider } from "./utils/authProvider";

export default function App() {
  return (
    <AuthProvider>
      <div className="app-root">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/recipes" element={<RecipeBook />} />
            <Route path="/auth/*" element={<AuthPages />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}