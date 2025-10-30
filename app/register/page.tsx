"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return alert("Passwords do not match")
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        sessionStorage.setItem("reg_email", email)
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`)
      } else {
        alert(data.error || "Failed to request OTP")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to request OTP. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-emerald-800 overflow-hidden">
      {/* Floating gradient lights */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1.3 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[500px] h-[500px] bg-emerald-400 rounded-full blur-3xl top-1/4 left-1/3"
      />
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.15, scale: 1.5 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute w-[600px] h-[600px] bg-cyan-400 rounded-full blur-3xl bottom-1/3 right-1/4"
      />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md rounded-3xl p-[2px] bg-gradient-to-r from-emerald-400 via-cyan-500 to-indigo-500 shadow-2xl"
      >
        <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center text-gray-200">
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg">
              <TrendingUp size={26} className="text-white" />
            </div>
            <h1 className="mt-3 text-3xl font-extrabold bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Create Your StockAI Account
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              A 6-digit verification code will be sent to your email
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/40 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/40 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/40 text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Confirm Password</label>
              <input
                type="password"
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-black/40 text-white focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Sending OTP..." : "Register & Verify Email"}
            </motion.button>
          </form>

          {/* Bottom Link */}
          <div className="mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-400 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
