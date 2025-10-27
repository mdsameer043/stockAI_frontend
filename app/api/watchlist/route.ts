import { NextResponse } from "next/server"

let watchlist: any[] = []

export async function GET() {
  return NextResponse.json({ watchlist })
}

export async function POST(req: Request) {
  const { symbol, name, price } = await req.json()
  if (!symbol) return NextResponse.json({ error: "Symbol required" }, { status: 400 })
  if (watchlist.find((s) => s.symbol === symbol))
    return NextResponse.json({ message: "Already in watchlist" })
  watchlist.push({ symbol, name, price })
  return NextResponse.json({ success: true })
}
