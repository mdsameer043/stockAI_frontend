import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const record = await db.collection("pending_verifications").findOne({ email })

    if (!record) {
      return NextResponse.json({ error: "No OTP request found for this email" }, { status: 400 })
    }

    if (record.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    if (new Date() > new Date(record.otpExpires)) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(record.password, 10)
    const users = db.collection("users")

    await users.insertOne({
      name: record.name,
      email: record.email,
      password: hashedPassword,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.collection("pending_verifications").deleteOne({ email })

    return NextResponse.json({ success: true, message: "Email verified successfully" })
  } catch (err) {
    console.error("OTP verification error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
