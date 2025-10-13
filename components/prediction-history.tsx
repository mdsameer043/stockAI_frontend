"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PredictionHistoryProps {
  symbol: string
}

export function PredictionHistory({ symbol }: PredictionHistoryProps) {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/predict/history?symbol=${symbol}`)
        const data = await response.json()
        setHistory(data.history || [])
      } catch (error) {
        console.error("Error fetching prediction history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [symbol])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prediction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading history...</p>
        </CardContent>
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prediction History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No prediction history available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((item, index) => {
            const isUptrend = item.direction === "UP"
            const wasCorrect = item.actual_direction === item.direction

            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {isUptrend ? (
                    <TrendingUp className="h-5 w-5 text-success" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{new Date(item.date).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      Predicted: ${item.predicted_price.toFixed(2)} | Actual: ${item.actual_price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={wasCorrect ? "default" : "secondary"} className={cn(wasCorrect && "bg-success")}>
                    {wasCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{(item.confidence * 100).toFixed(0)}% conf.</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
