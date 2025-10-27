"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StockCard } from "@/components/stock-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RefreshCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [stocksData, setStocksData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function fetchWatchlist() {
    try {
      const res = await fetch("/api/watchlist")
      const data = await res.json()
      return Array.isArray(data.watchlist) ? data.watchlist : []
    } catch (err) {
      console.error("Failed to fetch watchlist:", err)
      return []
    }
  }

  async function fetchStock(symbol: string) {
    try {
      const res = await fetch(`/api/stocks/${symbol}`)
      const data = await res.json()
      return {
        symbol: data.symbol ?? "UNKNOWN",
        name: data.name ?? "Unknown",
        price: Number(data.price ?? 0),
        change: Number(data.change ?? 0),
        changePercent: Number(data.changePercent ?? 0),
        volume: Number(data.volume ?? 0),
      }
    } catch (err) {
      console.error("Failed to fetch stock:", symbol, err)
      return {
        symbol,
        name: "Unavailable",
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
      }
    }
  }

  async function refreshData() {
    setRefreshing(true)
    const list = await fetchWatchlist()
    const symbols = list.map((s) => s.symbol ?? s.symbol?.symbol ?? "UNKNOWN")
    const data = await Promise.all(symbols.map(fetchStock))
    setStocksData(data)
    setWatchlist(list)
    setRefreshing(false)
    setLoading(false)
  }

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function remove(symbol: string) {
    try {
      await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" })
      refreshData()
    } catch (err) {
      console.error("Failed to remove:", err)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-600/80 to-indigo-700/80 p-6 rounded-2xl shadow-md text-white">
          <div>
            <h1 className="text-3xl font-bold">📈 My Watchlist (Live)</h1>
            <p className="text-blue-100 mt-1 text-sm">
              Auto-refreshing every 30 seconds with real-time market data
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white"
              onClick={refreshData}
            >
              <RefreshCcw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh Now
            </Button>
            <Link href="/dashboard">
              <Button variant="default" className="bg-white text-blue-700 hover:bg-gray-100">
                + Add Stocks
              </Button>
            </Link>
          </div>
        </div>

        {/* Stock Cards */}
        {loading ? (
          <div className="p-12 text-center text-muted-foreground text-lg">
            Fetching live prices...
          </div>
        ) : stocksData.length ? (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {stocksData.map((stock) => (
                <motion.div
                  key={stock.symbol}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <div className="transition-all transform hover:scale-[1.02] hover:shadow-lg">
                    <StockCard stock={stock} />
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => remove(stock.symbol)}
                  >
                    Remove
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 rounded-xl border border-dashed bg-muted/30 text-muted-foreground">
            <p className="text-lg mb-2 font-medium">No stocks in your watchlist</p>
            <p className="text-sm">Start tracking your favorite stocks today!</p>
            <Link href="/dashboard">
              <Button className="mt-4">Add Stocks</Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
