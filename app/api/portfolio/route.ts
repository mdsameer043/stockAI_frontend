import { NextResponse } from "next/server"

// Mock portfolio endpoint
export async function GET() {
  try {
    // Mock portfolio data
    const portfolio = [
      {
        symbol: "TCS.NS",
        shares: 10,
        avgPrice: 4000.0,
        currentPrice: 4213.5,
        value: 42135.0,
        gain: 2135.0,
        gainPercent: 5.34,
      },
      {
        symbol: "INFY.NS",
        shares: 25,
        avgPrice: 1800.0,
        currentPrice: 1876.25,
        value: 46906.25,
        gain: 1906.25,
        gainPercent: 4.23,
      },
      {
        symbol: "RELIANCE.NS",
        shares: 5,
        avgPrice: 3100.0,
        currentPrice: 2987.6,
        value: 14938.0,
        gain: -562.0,
        gainPercent: -3.63,
      },
    ]

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
