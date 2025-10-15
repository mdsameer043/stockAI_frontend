import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { sendOtpEmail } from "@/lib/mail"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const users = db.collection("users")
    const existingUser = await users.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    await db.collection("pending_verifications").updateOne(
      { email },
      { $set: { name, email, password, otp, otpExpires } },
      { upsert: true }
    )

    await sendOtpEmail(email, otp)

    return NextResponse.json({ success: true, message: "OTP sent successfully" })
  } catch (err) {
    console.error("Error sending OTP:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
