"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StockCard } from "@/components/stock-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Star } from "lucide-react"
import Link from "next/link"

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch("/api/watchlist")
        const data = await response.json()
        setWatchlist(data.watchlist || [])
      } catch (error) {
        console.error("Error fetching watchlist:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWatchlist()
  }, [])

  const removeFromWatchlist = async (symbol: string) => {
    try {
      await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" })
      setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol))
    } catch (error) {
      console.error("Error removing from watchlist:", error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">My Watchlist</h1>
            <p className="text-muted-foreground mt-2">Track your favorite stocks and monitor their performance</p>
          </div>
          <Link href="/dashboard">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Stocks
            </Button>
          </Link>
        </div>

        {/* Watchlist Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading watchlist...</p>
            </div>
          </div>
        ) : watchlist.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((stock) => (
              <div key={stock.symbol} className="relative group">
                <StockCard stock={stock} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromWatchlist(stock.symbol)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
              <p className="text-muted-foreground mb-4">Start adding stocks to track their performance</p>
              <Link href="/dashboard">
                <Button>Browse Stocks</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
