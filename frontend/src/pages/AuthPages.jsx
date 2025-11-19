import React, { useState } from "react";
import { useAuth } from "../utils/authProvider";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await login(form.username, form.password);
      } else {
        await register(form.username, form.password);
      }
      navigate("/");
    } catch (err) {
      alert(err.message || "Authentication failed. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950 overflow-hidden p-6">
      
      {/* Ambient Glowing Orbs */}
      <div className="absolute w-96 h-96 bg-purple-600/40 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-purple-400/30 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <div className="relative w-full max-w-md bg-white/10 border border-purple-300/50 
        backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.6)] rounded-2xl p-10 
        transition-all duration-300 hover:shadow-[0_0_45px_rgba(168,85,247,0.9)]">

        <h2 className="text-4xl font-extrabold text-purple-200 text-center mb-8 drop-shadow-lg">
          {isLoginMode ? "Welcome Back, Alchemist" : "Create Your Grimoire"}
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div>
            <label className="block text-purple-200 font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white 
              placeholder-purple-300 border border-purple-300/40 
              focus:ring-4 focus:ring-purple-500/70 focus:border-purple-400 
              outline-none transition shadow-[0_0_10px_rgba(168,85,247,0.3)]
              focus:shadow-[0_0_20px_rgba(168,85,247,0.8)]"
              placeholder="Enter your username"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-purple-200 font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white 
                placeholder-purple-300 border border-purple-300/40 
                focus:ring-4 focus:ring-purple-500/70 focus:border-purple-400 
                outline-none transition shadow-[0_0_10px_rgba(168,85,247,0.3)]
                focus:shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1 -y-1/2 text-purple-700 bg-transparent border-none outline-none hover:bg-transparent active:bg-transparent focus:bg-transparent"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 
            text-white py-3 rounded-xl font-bold text-lg mt-2
            shadow-[0_0_20px_rgba(168,85,247,0.8)]
            hover:shadow-[0_0_35px_rgba(168,85,247,1)]
            transition-all duration-200 hover:scale-[1.03]"
          >
            {isLoginMode ? "Sign In" : "Register"}
          </button>
        </form>

        {/* MODE SWITCH */}
        <div className="text-center mt-6">
          <p className="text-purple-200">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="ml-2 text-purple-300 hover:text-purple-100 
              font-semibold underline underline-offset-4 transition bg-transparent"
            >
              {isLoginMode ? "Register Here" : "Login Here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
