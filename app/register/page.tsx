// app/register/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
        // store minimal reg data locally so we can clear after verification
        // We don't store password locally
        sessionStorage.setItem("reg_email", email)
        // go to verify page
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 text-center border-b">
          <h1 className="text-2xl font-extrabold">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">We will send a 6-digit code to your email to verify your account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input className="w-full px-4 py-3 rounded-lg border border-gray-200" value={name} onChange={(e) => setName(e.target.value)} required />

            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" minLength={6} className="w-full px-4 py-3 rounded-lg border border-gray-200" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" minLength={6} className="w-full px-4 py-3 rounded-lg border border-gray-200" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <button type="submit" disabled={isLoading} className="mt-6 w-full bg-black text-white py-3 rounded-lg">
            {isLoading ? "Sending OTP..." : "Register & Send OTP"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <Link href="/login" className="font-medium text-black underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
