"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PredictionPanelProps {
  symbol: string
  currentPrice: number
}

export function PredictionPanel({ symbol, currentPrice }: PredictionPanelProps) {
  const [prediction, setPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPrediction = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/predict?symbol=${symbol}`)
        const data = await response.json()
        setPrediction(data)
      } catch (error) {
        console.error("Prediction error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrediction()
  }, [symbol])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing market data...</p>
        </CardContent>
      </Card>
    )
  }

  if (!prediction) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">Unable to generate prediction</CardContent>
      </Card>
    )
  }

  const isUptrend = prediction.direction === "UP"
  const confidenceLevel = prediction.confidence * 100

  return (
    <Card className="border-2">
      <CardContent className="pt-6 space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Predicted Next-Day Price</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold">${prediction.predicted_price.toFixed(2)}</span>
            {isUptrend ? (
              <TrendingUp className="h-6 w-6 text-success" />
            ) : (
              <TrendingDown className="h-6 w-6 text-destructive" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Direction</span>
            <Badge variant={isUptrend ? "default" : "destructive"} className={cn(isUptrend && "bg-success")}>
              {prediction.direction}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Expected Change</span>
            <span className={cn("font-medium", isUptrend ? "text-success" : "text-destructive")}>
              {isUptrend ? "+" : ""}
              {prediction.change_percent.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Model Confidence</span>
            <span className="font-medium">{confidenceLevel.toFixed(0)}%</span>
          </div>
        </div>

        <div className="pt-2">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all",
                confidenceLevel >= 70 ? "bg-success" : confidenceLevel >= 50 ? "bg-primary" : "bg-destructive",
              )}
              style={{ width: `${confidenceLevel}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {confidenceLevel >= 70
              ? "High confidence"
              : confidenceLevel >= 50
                ? "Moderate confidence"
                : "Low confidence"}
          </p>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            AI predictions are for informational purposes only. Always do your own research before investing.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
