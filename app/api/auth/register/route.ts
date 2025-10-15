// app/auth/register/route.ts

import { NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/db-helpers"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secret"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // 🚨 Correction for the user object being returned: createUser returns a user with a string _id
    const user = await createUser(email, password, name)

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    return NextResponse.json({ 
        success: true, 
        token, 
        user: { id: user._id, name: user.name, email: user.email } // Use the string ID
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}