import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const horizon = searchParams.get("horizon") || "1"

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    // Call Flask backend
    const flaskURL = `http://localhost:5000/predict?symbol=${symbol}&horizon=${horizon}`
    const response = await fetch(flaskURL)
    if (!response.ok) {
      throw new Error(`Flask service error: ${response.statusText}`)
    }

    const flaskData = await response.json()

    // Return Flask response directly
    return NextResponse.json(flaskData)

  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}
