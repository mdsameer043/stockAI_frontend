// app/auth/login/route.ts

import { NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/db-helpers"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { DbUser } from "@/lib/mongodb" // Import DbUser interface

const JWT_SECRET = process.env.JWT_SECRET || "secret"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user: DbUser | null = await findUserByEmail(email)
    if (!user) {
      // User not found in database
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // ✅ Validate password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      // Password does not match
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // 🚨 CORRECTION: Ensure user._id is passed as a string for JWT, as MongoDB returns an ObjectId
    const userIdString = user._id.toString()

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: userIdString, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // ✅ Send success response
    return NextResponse.json({
      success: true,
      token,
      user: { id: userIdString, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error("❌ Login Error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}