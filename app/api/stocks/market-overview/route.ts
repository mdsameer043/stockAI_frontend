import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

async function getPrice(symbol: string) {
  try {
    const url = `https://www.google.com/finance/quote/${symbol}:NSE`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    const priceText = $(".YMlKec.fxKbKc").first().text().replace(/[₹,]/g, "");
    const price = parseFloat(priceText);
    return price || null;
  } catch (err) {
    console.error("Error fetching price:", symbol, err);
    return null;
  }
}

export async function GET() {
  const stocks = ["INFY", "TCS", "RELIANCE", "HDFCBANK", "ICICIBANK", "SBIN"];
  const results = await Promise.all(
    stocks.map(async (symbol) => {
      const price = await getPrice(symbol);
      const change = (Math.random() * 10 - 5).toFixed(2);
      const changePercent = ((+change / price) * 100).toFixed(2);
      return {
        symbol,
        name: symbol,
        price,
        change: +change,
        changePercent: +changePercent,
        volume: Math.floor(Math.random() * 1_000_000),
      };
    })
  );

  const topGainers = results.filter((s) => s.change > 0);
  const topLosers = results.filter((s) => s.change < 0);
  const trending = results.slice(0, 3);

  return NextResponse.json({ topGainers, topLosers, trending });
}
