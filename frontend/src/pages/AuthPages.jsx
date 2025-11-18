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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-700 to-purple-900">
      <div className="bg-white/40 p-8 rounded-xl shadow-xl w-full max-w-md border border-purple-400 backdrop-blur-sm">

        <h2 className="text-3xl font-extrabold text-purple-800 text-center mb-6">
          {isLoginMode ? "Welcome Back, Alchemist" : "Create Your Grimoire"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold text-purple-900 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-purple-400 rounded-md px-3 py-2 bg-white/20 backdrop-blur-sm text-black placeholder-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block font-semibold text-purple-900 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-purple-400 rounded-md px-3 py-2 bg-white/20 backdrop-blur-sm text-black placeholder-gray-600 focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-700 bg-transparent border-none outline-none hover:bg-transparent active:bg-transparent focus:bg-transparent"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-md font-semibold shadow-md transition text-lg"
            >
              {isLoginMode ? "Sign In" : "Register"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-purple-900">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="font-semibold text-purple-700 hover:text-purple-600 ml-2 bg-transparent border-none p-0"
            >
              {isLoginMode ? "Register Here" : "Login Here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
