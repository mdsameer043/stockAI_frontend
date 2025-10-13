import { NextResponse } from "next/server"

// Mock prediction history endpoint
// In production, this would fetch from MongoDB
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    // Mock historical predictions
    const generateHistory = () => {
      const history = []
      const today = new Date()

      for (let i = 7; i >= 1; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        const isUptrend = Math.random() > 0.5
        const predictedPrice = 1000 + Math.random() * 3000
        const actualPrice = predictedPrice * (0.95 + Math.random() * 0.1)
        const actualDirection = actualPrice > predictedPrice ? "UP" : "DOWN"

        history.push({
          date: date.toISOString(),
          predicted_price: Number.parseFloat(predictedPrice.toFixed(2)),
          actual_price: Number.parseFloat(actualPrice.toFixed(2)),
          direction: isUptrend ? "UP" : "DOWN",
          actual_direction: actualDirection,
          confidence: 0.7 + Math.random() * 0.25,
        })
      }

      return history
    }

    const history = generateHistory()

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error fetching prediction history:", error)
    return NextResponse.json({ error: "Failed to fetch prediction history" }, { status: 500 })
  }
}
