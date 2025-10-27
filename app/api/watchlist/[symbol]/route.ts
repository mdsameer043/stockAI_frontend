import { NextResponse } from "next/server"

let watchlist: any[] = []

export async function DELETE(
  req: Request,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params
  watchlist = watchlist.filter((s) => s.symbol !== symbol)
  return NextResponse.json({ success: true })
}
