import { NextResponse } from "next/server"

// Mock watchlist endpoint
// In production, this would fetch from MongoDB based on user ID
export async function GET() {
  try {
    // Mock watchlist data
    const watchlist = [
      {
        symbol: "TCS.NS",
        name: "Tata Consultancy Services",
        price: 4213.5,
        change: 52.3,
        changePercent: 1.26,
        volume: 2345678,
      },
      {
        symbol: "INFY.NS",
        name: "Infosys Limited",
        price: 1876.25,
        change: 34.75,
        changePercent: 1.89,
        volume: 3456789,
      },
      {
        symbol: "RELIANCE.NS",
        name: "Reliance Industries",
        price: 2987.6,
        change: 45.2,
        changePercent: 1.54,
        volume: 4567890,
      },
    ]

    return NextResponse.json({ watchlist })
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { symbol } = await request.json()

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    // In production, add to MongoDB
    return NextResponse.json({ success: true, message: "Added to watchlist" })
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 })
  }
}
