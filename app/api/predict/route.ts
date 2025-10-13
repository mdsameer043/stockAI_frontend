import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")
    const horizon = searchParams.get("horizon") || "1"

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    // 🧠 Call your Flask backend
    const flaskURL = `http://localhost:5000/predict?horizon=${horizon}`
    const response = await fetch(flaskURL)
    if (!response.ok) {
      throw new Error(`Flask service error: ${response.statusText}`)
    }

    const flaskData = await response.json()

    // You can adjust mapping if needed
    // Example: if Flask returns a list of predictions, take the last one
    const latest = flaskData.predictions?.at(-1)

    const prediction = {
      symbol,
      predicted_price: Number.parseFloat(latest.predicted_close.toFixed(2)),
      confidence: 0.9, // Optional: fixed confidence or model-provided
      direction: latest.predicted_close > 0 ? "UP" : "DOWN",
      change_percent: 1.25, // optional placeholder
      model: "AttCLX",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}
