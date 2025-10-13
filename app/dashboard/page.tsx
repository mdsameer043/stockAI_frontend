"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StockSearch } from "@/components/stock-search"
import { StockCard } from "@/components/stock-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

export default function DashboardPage() {
  const [topGainers, setTopGainers] = useState<any[]>([])
  const [topLosers, setTopLosers] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch stock data
    const fetchStocks = async () => {
      try {
        const response = await fetch("/api/stocks/market-overview")
        const data = await response.json()
        setTopGainers(data.topGainers || [])
        setTopLosers(data.topLosers || [])
        setTrending(data.trending || [])
      } catch (error) {
        console.error("Error fetching stocks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStocks()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Market Overview</h1>
          <p className="text-muted-foreground mt-2">
            Search stocks and get AI-powered predictions for smarter investments
          </p>
        </div>

        {/* Search Bar */}
        <StockSearch />

        {/* Market Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Gainers</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topGainers.length}</div>
              <p className="text-xs text-muted-foreground">Stocks up today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Losers</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topLosers.length}</div>
              <p className="text-xs text-muted-foreground">Stocks down today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trending</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trending.length}</div>
              <p className="text-xs text-muted-foreground">Most searched stocks</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Lists */}
        <Tabs defaultValue="gainers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="gainers" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading stocks...</div>
            ) : topGainers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topGainers.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">No data available</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="losers" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading stocks...</div>
            ) : topLosers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topLosers.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">No data available</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading stocks...</div>
            ) : trending.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trending.map((stock) => (
                  <StockCard key={stock.symbol} stock={stock} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">No data available</CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
