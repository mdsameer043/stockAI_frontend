import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.toUpperCase() || ""
  if (!q) return NextResponse.json({ results: [] })

  const list = [
    "TCS", "INFY", "RELIANCE", "HDFCBANK",
    "WIPRO", "BHARTIARTL", "ICICIBANK", "SBIN",
    "AXISBANK", "MARUTI", "SUNPHARMA", "ADANIENT",
    "ITC", "HINDUNILVR", "BAJFINANCE", "ASIANPAINT", "LT"
  ]

  const filtered = list.filter((s) => s.includes(q))
  const results = filtered.map((sym) => ({
    symbol: `${sym}.NS`,
    name: sym,
  }))

  return NextResponse.json({ results })
}
