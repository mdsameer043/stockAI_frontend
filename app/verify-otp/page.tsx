// app/verify-otp/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qEmail = searchParams.get("email")
    if (qEmail) {
      setEmail(qEmail)
      sessionStorage.setItem("reg_email", qEmail)
    } else {
      // fallback: try sessionStorage
      const stored = sessionStorage.getItem("reg_email")
      if (stored) setEmail(stored)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return alert("Missing email")
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (res.ok) {
        // success
        sessionStorage.removeItem("reg_email")
        alert("Your Account has Created Successfully! Please login.")
        router.push("/login")
      } else {
        alert(data.error || "Invalid OTP")
      }
    } catch (err) {
      console.error(err)
      alert("Verification failed. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    // To resend, we need original registration details; simplest approach: ask user to re-register.
    // Alternatively you can implement a resend endpoint using stored payload on server.
    alert("To resend the OTP, please go back to register and submit again.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 text-center border-b">
          <h1 className="text-2xl font-extrabold">Verify Email</h1>
          <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code sent to <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">OTP</label>
            <input type="text" inputMode="numeric" maxLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-200"
              value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required />

            <p className="text-xs text-gray-500">Didn't receive it? Check spam or go back to <Link href="/register" className="underline">register</Link>.</p>
          </div>

          <button type="submit" disabled={isLoading} className="mt-6 w-full bg-black text-white py-3 rounded-lg">
            {isLoading ? "Verifying..." : "Verify & Create Account"}
          </button>

          <button type="button" onClick={handleResend} className="mt-3 w-full border border-gray-200 py-2 rounded-lg">
            Resend OTP
          </button>
        </form>
      </div>
    </div>
  )
}
