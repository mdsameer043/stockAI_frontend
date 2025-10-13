import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params

    // In production, remove from MongoDB
    return NextResponse.json({ success: true, message: "Removed from watchlist" })
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 })
  }
}
