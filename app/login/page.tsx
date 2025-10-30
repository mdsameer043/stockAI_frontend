"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        window.location.href = "/dashboard"
      } else {
        alert(data.error)
      }
    } catch {
      alert("Login failed. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-800 overflow-hidden">
      {/* Animated glowing orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1.3 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[500px] h-[500px] bg-emerald-400 rounded-full blur-3xl top-1/3 left-1/4"
      />
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.15, scale: 1.4 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[600px] h-[600px] bg-cyan-400 rounded-full blur-3xl bottom-1/4 right-1/3"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md rounded-3xl p-[2px] bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-500 shadow-2xl"
      >
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center text-gray-200">
          {/* Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
              <TrendingUp size={26} className="text-white" />
            </div>
            <h1 className="mt-3 text-3xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Welcome Back to StockAI
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Sign in to your{" "}
              <span className="text-emerald-400 font-semibold">
                AI-powered trading dashboard
              </span>
            </p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/40 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Password
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/40 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-400/30 transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Bottom Links */}
          <div className="mt-6 text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-emerald-400 font-semibold hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
