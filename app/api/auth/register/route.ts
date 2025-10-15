// app/auth/register/route.ts
import { NextResponse } from "next/server"
import { createUser, findUserByEmail, setVerificationToken } from "@/lib/db-helpers"
// import { sendVerificationEmail } from "@/lib/mail"
import crypto from "crypto"

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

    // Create user with default emailVerified false
    const user = await createUser(email, password, name, { emailVerified: false })

    // Generate a verification token and expiry (24 hours)
    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Save token on the user document
    await setVerificationToken(user._id, verificationToken, verificationExpires)

    // Send verification email (if mail server not configured, sendVerificationEmail logs link)
    // await sendVerificationEmail({
    //   to: user.email,
    //   name: user.name,
    //   token: verificationToken,
    // })

    return NextResponse.json({ success: true, message: "User created. Verification email sent." })
  } catch (err) {
    console.error("Registration error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
