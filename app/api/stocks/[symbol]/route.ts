import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

// Fetch current stock info from Google Finance
async function fetchCurrentStock(symbol: string) {
  const url = `https://www.google.com/finance/quote/${symbol}:NSE`
  try {
    const res = await fetch(url)
    const html = await res.text()
    const $ = cheerio.load(html)

    const priceText = $(".YMlKec.fxKbKc").first().text().replace(/[₹,]/g, "")
    const price = parseFloat(priceText) || 0
    const name = $("div.e1AOyf span").first().text().trim() || symbol

    const changeText = $("div[data-last-price-change]").attr("data-last-price-change") || "0"
    const change = parseFloat(changeText)
    const changePercent = (change / (price - change)) * 100 || 0

    return { name, price, change, changePercent }
  } catch (err) {
    console.error("Google Finance fetch error:", err)
    return { name: symbol, price: 0, change: 0, changePercent: 0 }
  }
}

// Fetch 10 days of real historical prices from Yahoo Finance
async function fetchHistoricalData(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?range=10d&interval=1d`
  try {
    const res = await fetch(url)
    const data = await res.json()
    const timestamps = data?.chart?.result?.[0]?.timestamp
    const quotes = data?.chart?.result?.[0]?.indicators?.quote?.[0]

    if (!timestamps || !quotes) return []

    return timestamps.map((t: number, i: number) => {
      const date = new Date(t * 1000)
      return {
        date,
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        close: quotes.close[i],
        volume: quotes.volume[i],
      }
    })
  } catch (err) {
    console.error("Yahoo Finance fetch error:", err)
    return []
  }
}

export async function GET(req: Request, { params }: { params: { symbol: string } }) {
  const { symbol } = params

  const [stock, historicalData] = await Promise.all([
    fetchCurrentStock(symbol),
    fetchHistoricalData(symbol),
  ])

  const stockData = {
    symbol,
    name: stock.name,
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: historicalData?.[historicalData.length - 1]?.volume || 0,
    high52Week: stock.price * 1.25,
    low52Week: stock.price * 0.75,
    marketCap: `${(stock.price * 1_000_000_0).toLocaleString()} INR`,
    indicators: {
      ma20: stock.price * 0.98,
      ma50: stock.price * 1.01,
      ma200: stock.price * 1.05,
      rsi: Math.random() * 100,
      macd: Math.random() * 10 - 5,
      signal: Math.random() * 10 - 5,
    },
    historicalData,
  }

  return NextResponse.json(stockData)
}
