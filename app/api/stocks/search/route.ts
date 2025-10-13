import { NextResponse } from "next/server"

// Mock search functionality
// In production, this would search Yahoo Finance API or Alpha Vantage
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    // Mock stock database
    const allStocks = [
      { symbol: "TCS.NS", name: "Tata Consultancy Services", price: 4213.5, changePercent: 1.26 },
      { symbol: "INFY.NS", name: "Infosys Limited", price: 1876.25, changePercent: 1.89 },
      { symbol: "RELIANCE.NS", name: "Reliance Industries", price: 2987.6, changePercent: 1.54 },
      { symbol: "HDFCBANK.NS", name: "HDFC Bank", price: 1654.3, changePercent: 1.78 },
      { symbol: "WIPRO.NS", name: "Wipro Limited", price: 567.8, changePercent: 2.23 },
      { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", price: 1234.5, changePercent: 1.94 },
      { symbol: "TATAMOTORS.NS", name: "Tata Motors", price: 876.4, changePercent: -1.75 },
      { symbol: "ICICIBANK.NS", name: "ICICI Bank", price: 1123.7, changePercent: -1.6 },
      { symbol: "SBIN.NS", name: "State Bank of India", price: 654.2, changePercent: -1.77 },
      { symbol: "AXISBANK.NS", name: "Axis Bank", price: 987.5, changePercent: -1.45 },
      { symbol: "MARUTI.NS", name: "Maruti Suzuki", price: 11234.6, changePercent: -1.56 },
      { symbol: "SUNPHARMA.NS", name: "Sun Pharmaceutical", price: 1456.8, changePercent: -1.57 },
      { symbol: "ADANIENT.NS", name: "Adani Enterprises", price: 2345.6, changePercent: 0.53 },
      { symbol: "ITC.NS", name: "ITC Limited", price: 456.7, changePercent: 0.71 },
      { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever", price: 2678.9, changePercent: -0.3 },
      { symbol: "BAJFINANCE.NS", name: "Bajaj Finance", price: 7654.3, changePercent: 0.6 },
      { symbol: "ASIANPAINT.NS", name: "Asian Paints", price: 3456.7, changePercent: -0.35 },
      { symbol: "LT.NS", name: "Larsen & Toubro", price: 3678.9, changePercent: 0.64 },
    ]

    // Filter stocks based on query
    const results = allStocks.filter(
      (stock) => stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query),
    )

    return NextResponse.json({ results: results.slice(0, 10) })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
