import { NextResponse } from "next/server"

// Mock detailed stock data
// In production, this would fetch from Yahoo Finance API
export async function GET(request: Request, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params

    // Generate mock historical data (30 days)
    const generateHistoricalData = (basePrice: number) => {
      const data = []
      let currentPrice = basePrice
      const today = new Date()

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)

        const volatility = 0.02
        const change = (Math.random() - 0.5) * volatility * currentPrice
        currentPrice += change

        const open = currentPrice + (Math.random() - 0.5) * 10
        const close = currentPrice
        const high = Math.max(open, close) + Math.random() * 20
        const low = Math.min(open, close) - Math.random() * 20

        data.push({
          date: date.toISOString(),
          open: Number.parseFloat(open.toFixed(2)),
          high: Number.parseFloat(high.toFixed(2)),
          low: Number.parseFloat(low.toFixed(2)),
          close: Number.parseFloat(close.toFixed(2)),
          volume: Math.floor(Math.random() * 5000000) + 1000000,
        })
      }

      return data
    }

    // Mock stock database
    const stockDatabase: Record<string, any> = {
      "TCS.NS": {
        symbol: "TCS.NS",
        name: "Tata Consultancy Services",
        price: 4213.5,
        change: 52.3,
        changePercent: 1.26,
        volume: 2345678,
        high52Week: 4500.0,
        low52Week: 3200.0,
        marketCap: "$154.2B",
      },
      "INFY.NS": {
        symbol: "INFY.NS",
        name: "Infosys Limited",
        price: 1876.25,
        change: 34.75,
        changePercent: 1.89,
        volume: 3456789,
        high52Week: 2000.0,
        low52Week: 1400.0,
        marketCap: "$78.5B",
      },
      "RELIANCE.NS": {
        symbol: "RELIANCE.NS",
        name: "Reliance Industries",
        price: 2987.6,
        change: 45.2,
        changePercent: 1.54,
        volume: 4567890,
        high52Week: 3200.0,
        low52Week: 2300.0,
        marketCap: "$202.1B",
      },
    }

    // Get stock data or use default
    const stockData = stockDatabase[symbol] || {
      symbol,
      name: symbol.replace(".NS", ""),
      price: 1000 + Math.random() * 3000,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 5000000) + 1000000,
      high52Week: 5000,
      low52Week: 800,
      marketCap: "$50.0B",
    }

    // Add historical data and indicators
    const historicalData = generateHistoricalData(stockData.price)
    const indicators = {
      ma20: stockData.price * (0.98 + Math.random() * 0.04),
      ma50: stockData.price * (0.95 + Math.random() * 0.1),
      ma200: stockData.price * (0.9 + Math.random() * 0.2),
      rsi: 30 + Math.random() * 40,
      macd: (Math.random() - 0.5) * 20,
      signal: (Math.random() - 0.5) * 15,
    }

    return NextResponse.json({
      ...stockData,
      historicalData,
      indicators,
    })
  } catch (error) {
    console.error("Error fetching stock details:", error)
    return NextResponse.json({ error: "Failed to fetch stock details" }, { status: 500 })
  }
}
