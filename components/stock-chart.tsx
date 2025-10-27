"use client"

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { motion } from "framer-motion"

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
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        No chart data available
      </div>
    )
  }

  // Format data for chart
  const chartData = historicalData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: item.close,
  }))

  const isPositiveTrend =
    historicalData[historicalData.length - 1].close >
    historicalData[0].close

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[420px] w-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-xl border border-border shadow-sm p-4"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 25, left: -5, bottom: 5 }}
        >
          <defs>
            {/* Gradient for main area */}
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={
                  isPositiveTrend
                    ? "rgb(34,197,94)" // green-500
                    : "rgb(239,68,68)" // red-500
                }
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={
                  isPositiveTrend
                    ? "rgb(34,197,94)"
                    : "rgb(239,68,68)"
                }
                stopOpacity={0.05}
              />
            </linearGradient>

            {/* Subtle glow under the line */}
            <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="hsl(var(--muted-foreground)/0.2)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              background:
                "linear-gradient(to bottom right, hsl(var(--card)), hsl(var(--background)))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            labelStyle={{
              color: "hsl(var(--foreground))",
              fontWeight: 500,
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={
              isPositiveTrend
                ? "rgb(34,197,94)" // green
                : "rgb(239,68,68)" // red
            }
            strokeWidth={2.5}
            fill="url(#colorPrice)"
            filter="url(#glow)"
            animationDuration={1500}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
