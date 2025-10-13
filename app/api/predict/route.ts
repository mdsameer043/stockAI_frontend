import { NextResponse } from "next/server"

// Mock AI prediction endpoint
// In production, this would call the FastAPI ML service at http://ml-service:8000/predict
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock prediction data
    // In production, this would be:
    // const response = await fetch(`http://ml-service:8000/predict?symbol=${symbol}`)
    // const prediction = await response.json()

    const isUptrend = Math.random() > 0.5
    const baseChange = Math.random() * 3
    const changePercent = isUptrend ? baseChange : -baseChange

    // Get current price (mock)
    const currentPrice = 1000 + Math.random() * 3000
    const predictedPrice = currentPrice * (1 + changePercent / 100)

    const prediction = {
      symbol,
      predicted_price: Number.parseFloat(predictedPrice.toFixed(2)),
      confidence: 0.7 + Math.random() * 0.25, // 70-95% confidence
      direction: isUptrend ? "UP" : "DOWN",
      change_percent: Number.parseFloat(changePercent.toFixed(2)),
      model: "AttCLX",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}
