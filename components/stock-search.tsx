"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"

export function StockSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectStock = (symbol: string) => {
    router.push(`/stock/${symbol}`)
    setQuery("")
    setResults([])
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stocks by name or symbol (e.g., TCS, RELIANCE, INFY)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            className="pl-10"
          />
        </div>
        <Button onClick={() => handleSearch(query)} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
          <div className="divide-y">
            {results.map((stock) => (
              <button
                key={stock.symbol}
                onClick={() => handleSelectStock(stock.symbol)}
                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-sm text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${stock.price?.toFixed(2)}</div>
                  <div className={cn("text-sm", stock.changePercent >= 0 ? "text-success" : "text-destructive")}>
                    {stock.changePercent >= 0 ? "+" : ""}
                    {stock.changePercent?.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
