import { NextResponse } from "next/server"

// Mock user stats endpoint
export async function GET() {
  try {
    const stats = {
      totalPredictions: 47,
      accuracyRate: 73,
      watchlistSize: 8,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
