// app/api/predict/history/route.ts
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get("symbol")

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    console.log(`📡 Fetching prediction history for: ${symbol}`)

    const days = 7
    const history: any[] = []

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

        // Safely pick predicted price (single) — fallback to first element of predicted_prices
        const rawPred =
          data?.predicted_price ??
          (Array.isArray(data?.predicted_prices) && data.predicted_prices.length > 0
            ? data.predicted_prices[0]
            : undefined)

        // If still undefined, skip this horizon entry
        if (rawPred === undefined || rawPred === null || Number.isNaN(Number(rawPred))) {
          console.warn(`⚠️ Missing predicted price for horizon ${horizon}, skipping.`)
          continue
        }

        const predicted_price = Number(Number(rawPred).toFixed(2))

        // create mock actual price only if predicted present
        const actualPrice = predicted_price * (0.95 + Math.random() * 0.1)
        const actualDirection = actualPrice > predicted_price ? "UP" : "DOWN"

        history.push({
          date: new Date(Date.now() - horizon * 24 * 60 * 60 * 1000).toISOString(),
          predicted_price,
          actual_price: Number(actualPrice.toFixed(2)),
          direction: data?.direction || (data?.change_percent > 0 ? "UP" : "DOWN"),
          actual_direction: actualDirection,
          confidence: data?.confidence ?? 0.8,
        })
      } catch (err) {
        console.error(`⚠️ Error fetching horizon ${horizon}:`, err)
      }
    }

    history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({ symbol, history })
  } catch (error) {
    console.error("🔥 Error fetching prediction history:", error)
    return NextResponse.json({ error: "Failed to fetch prediction history" }, { status: 500 })
  }
}
