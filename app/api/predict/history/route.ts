import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    console.log(`📡 Fetching prediction history for: ${symbol}`)

    // Number of past days (for example, last 7 predictions)
    const days = 7
    const history: any[] = []

    // Loop through multiple horizons (1–7)
    for (let horizon = 1; horizon <= days; horizon++) {
      const flaskURL = `http://127.0.0.1:5000/predict?symbol=${symbol}&horizon=${horizon}`

      try {
        const res = await fetch(flaskURL, {
          method: "GET",
          headers: { "Accept": "application/json" },
          cache: "no-store",
        })

        if (!res.ok) {
          console.error(`❌ Flask error on horizon ${horizon}:`, res.statusText)
          continue
        }

        const data = await res.json()

        // Add a mock "actual" value just for testing visualization
        const actualPrice =
          data.predicted_price * (0.95 + Math.random() * 0.1)
        const actualDirection = actualPrice > data.predicted_price ? "UP" : "DOWN"

        history.push({
          date: new Date(Date.now() - horizon * 24 * 60 * 60 * 1000).toISOString(),
          predicted_price: Number(data.predicted_price.toFixed(2)),
          actual_price: Number(actualPrice.toFixed(2)),
          direction: data.direction || (data.change_percent > 0 ? "UP" : "DOWN"),
          actual_direction: actualDirection,
          confidence: data.confidence || 0.8,
        })
      } catch (err) {
        console.error(`⚠️ Error fetching horizon ${horizon}:`, err)
      }
    }

    // Sort by date (oldest → newest)
    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ symbol, history })
  } catch (error) {
    console.error("🔥 Error fetching prediction history:", error)
    return NextResponse.json(
      { error: "Failed to fetch prediction history" },
      { status: 500 }
    )
  }
}
