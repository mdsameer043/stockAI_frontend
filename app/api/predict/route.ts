import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const horizon = searchParams.get("horizon") || "1"

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    console.log("🔍 Prediction API called:", symbol, "Horizon:", horizon)

    // --- Flask backend URL ---
    const flaskURL = `http://127.0.0.1:5000/predict?symbol=${symbol}&horizon=${horizon}`
    const response = await fetch(flaskURL, { method: "GET" })

    if (!response.ok) {
      const errText = await response.text()
      console.error("❌ Flask error:", errText)
      throw new Error(`Flask service error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("✅ Flask response:", data)

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      { error: "Failed to generate prediction" },
      { status: 500 }
    )
  }
}
