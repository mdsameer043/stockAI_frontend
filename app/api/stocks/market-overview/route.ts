import { NextResponse } from "next/server"

// Mock data for demonstration
// In production, this would fetch from Yahoo Finance API or Alpha Vantage
export async function GET() {
  try {
    // Mock stock data
    const mockStocks = {
      topGainers: [
        {
          symbol: "TCS.NS",
          name: "Tata Consultancy Services",
          price: 4213.5,
          change: 52.3,
          changePercent: 1.26,
          volume: 2345678,
        },
        {
          symbol: "INFY.NS",
          name: "Infosys Limited",
          price: 1876.25,
          change: 34.75,
          changePercent: 1.89,
          volume: 3456789,
        },
        {
          symbol: "RELIANCE.NS",
          name: "Reliance Industries",
          price: 2987.6,
          change: 45.2,
          changePercent: 1.54,
          volume: 4567890,
        },
        {
          symbol: "HDFCBANK.NS",
          name: "HDFC Bank",
          price: 1654.3,
          change: 28.9,
          changePercent: 1.78,
          volume: 5678901,
        },
        {
          symbol: "WIPRO.NS",
          name: "Wipro Limited",
          price: 567.8,
          change: 12.4,
          changePercent: 2.23,
          volume: 2345678,
        },
        {
          symbol: "BHARTIARTL.NS",
          name: "Bharti Airtel",
          price: 1234.5,
          change: 23.5,
          changePercent: 1.94,
          volume: 3456789,
        },
      ],
      topLosers: [
        {
          symbol: "TATAMOTORS.NS",
          name: "Tata Motors",
          price: 876.4,
          change: -15.6,
          changePercent: -1.75,
          volume: 4567890,
        },
        {
          symbol: "ICICIBANK.NS",
          name: "ICICI Bank",
          price: 1123.7,
          change: -18.3,
          changePercent: -1.6,
          volume: 5678901,
        },
        {
          symbol: "SBIN.NS",
          name: "State Bank of India",
          price: 654.2,
          change: -11.8,
          changePercent: -1.77,
          volume: 6789012,
        },
        {
          symbol: "AXISBANK.NS",
          name: "Axis Bank",
          price: 987.5,
          change: -14.5,
          changePercent: -1.45,
          volume: 3456789,
        },
        {
          symbol: "MARUTI.NS",
          name: "Maruti Suzuki",
          price: 11234.6,
          change: -178.4,
          changePercent: -1.56,
          volume: 1234567,
        },
        {
          symbol: "SUNPHARMA.NS",
          name: "Sun Pharmaceutical",
          price: 1456.8,
          change: -23.2,
          changePercent: -1.57,
          volume: 2345678,
        },
      ],
      trending: [
        {
          symbol: "ADANIENT.NS",
          name: "Adani Enterprises",
          price: 2345.6,
          change: 12.4,
          changePercent: 0.53,
          volume: 7890123,
        },
        {
          symbol: "ITC.NS",
          name: "ITC Limited",
          price: 456.7,
          change: 3.2,
          changePercent: 0.71,
          volume: 8901234,
        },
        {
          symbol: "HINDUNILVR.NS",
          name: "Hindustan Unilever",
          price: 2678.9,
          change: -8.1,
          changePercent: -0.3,
          volume: 1234567,
        },
        {
          symbol: "BAJFINANCE.NS",
          name: "Bajaj Finance",
          price: 7654.3,
          change: 45.6,
          changePercent: 0.6,
          volume: 2345678,
        },
        {
          symbol: "ASIANPAINT.NS",
          name: "Asian Paints",
          price: 3456.7,
          change: -12.3,
          changePercent: -0.35,
          volume: 3456789,
        },
        {
          symbol: "LT.NS",
          name: "Larsen & Toubro",
          price: 3678.9,
          change: 23.4,
          changePercent: 0.64,
          volume: 4567890,
        },
      ],
    }

    return NextResponse.json(mockStocks)
  } catch (error) {
    console.error("Error fetching market overview:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}
