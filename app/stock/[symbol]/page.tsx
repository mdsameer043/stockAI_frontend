"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StockChart } from "@/components/stock-chart"
import { PredictionPanel } from "@/components/prediction-panel"
import { PredictionHistory } from "@/components/prediction-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, TrendingUp, TrendingDown, Star } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function StockDetailPage() {
  const params = useParams()
  const symbol = params.symbol as string
  const [stockData, setStockData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPrediction, setShowPrediction] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(`/api/stocks/${symbol}`)
        const data = await response.json()
        setStockData(data)
      } catch (error) {
        console.error("Error fetching stock data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (symbol) {
      fetchStockData()
    }
  }, [symbol])

  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" })
        setIsInWatchlist(false)
      } else {
        await fetch("/api/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol }),
        })
        setIsInWatchlist(true)
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!stockData) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Stock not found</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const isPositive = stockData.changePercent >= 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Stock Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{stockData.symbol}</h1>
              <Button variant={isInWatchlist ? "default" : "outline"} size="icon" onClick={toggleWatchlist}>
                <Star className={cn("h-4 w-4", isInWatchlist && "fill-current")} />
              </Button>
            </div>
            <p className="text-lg text-muted-foreground">{stockData.name}</p>
          </div>
          <div className="text-left md:text-right">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">${stockData.price.toFixed(2)}</span>
              <Badge
                variant={isPositive ? "default" : "destructive"}
                className={cn("text-base", isPositive && "bg-success")}
              >
                {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {isPositive ? "+" : ""}
                {stockData.changePercent.toFixed(2)}%
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {isPositive ? "+" : ""}${stockData.change.toFixed(2)} today
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.volume?.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">52W High</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stockData.high52Week?.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">52W Low</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stockData.low52Week?.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.marketCap}</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Prediction */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Price Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <StockChart symbol={symbol} historicalData={stockData.historicalData} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>AI Prediction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get AI-powered predictions for next-day price movements with confidence levels.
                </p>
                <Button className="w-full" onClick={() => setShowPrediction(true)}>
                  Generate Prediction
                </Button>
                {showPrediction && <PredictionPanel symbol={symbol} currentPrice={stockData.price} />}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Prediction History */}
        <PredictionHistory symbol={symbol} />

        {/* Technical Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ma">
              <TabsList>
                <TabsTrigger value="ma">Moving Average</TabsTrigger>
                <TabsTrigger value="rsi">RSI</TabsTrigger>
                <TabsTrigger value="macd">MACD</TabsTrigger>
              </TabsList>
              <TabsContent value="ma" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">MA (20)</p>
                    <p className="text-2xl font-bold">${stockData.indicators?.ma20?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MA (50)</p>
                    <p className="text-2xl font-bold">${stockData.indicators?.ma50?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MA (200)</p>
                    <p className="text-2xl font-bold">${stockData.indicators?.ma200?.toFixed(2)}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="rsi" className="space-y-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Relative Strength Index</p>
                  <div className="flex items-center gap-4">
                    <p className="text-4xl font-bold">{stockData.indicators?.rsi?.toFixed(2)}</p>
                    <Badge
                      variant={
                        stockData.indicators?.rsi > 70
                          ? "destructive"
                          : stockData.indicators?.rsi < 30
                            ? "default"
                            : "secondary"
                      }
                    >
                      {stockData.indicators?.rsi > 70
                        ? "Overbought"
                        : stockData.indicators?.rsi < 30
                          ? "Oversold"
                          : "Neutral"}
                    </Badge>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="macd" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">MACD Line</p>
                    <p className="text-2xl font-bold">{stockData.indicators?.macd?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Signal Line</p>
                    <p className="text-2xl font-bold">{stockData.indicators?.signal?.toFixed(2)}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
