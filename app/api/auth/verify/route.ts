// app/auth/verify/route.ts
import { NextResponse } from "next/server"
import { findUserByVerificationToken, verifyUserById } from "@/lib/db-helpers"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 })

    const user = await findUserByVerificationToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // If token expired
    const now = new Date()
    if (!user.verificationExpires || user.verificationExpires < now) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    await verifyUserById(user._id.toString())

    // You can redirect to a "verified" page:
    return NextResponse.redirect(new URL("/login?verified=1", request.url))
  } catch (err) {
    console.error("Verify error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
