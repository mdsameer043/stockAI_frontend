"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface StockChartProps {
  symbol: string
  historicalData: Array<{
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }>
}

export function StockChart({ symbol, historicalData }: StockChartProps) {
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">No chart data available</div>
    )
  }

  // Format data for the chart
  const chartData = historicalData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    price: item.close,
    high: item.high,
    low: item.low,
  }))

  // Determine if trend is positive
  const isPositiveTrend = historicalData[historicalData.length - 1].close > historicalData[0].close

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={isPositiveTrend ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={isPositiveTrend ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositiveTrend ? "hsl(var(--success))" : "hsl(var(--destructive))"}
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
