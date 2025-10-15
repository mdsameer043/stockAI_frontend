// app/login/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp } from "lucide-react"

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 text-center border-b">
          <div className="inline-flex items-center justify-center bg-black text-white rounded-xl w-12 h-12 mx-auto mb-3">
            <TrendingUp size={20} />
          </div>
          <h1 className="text-2xl font-extrabold">StockAI</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account to access AI-powered stock predictions</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              placeholder="you@example.com"
            />

            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium shadow-sm disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-black underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
