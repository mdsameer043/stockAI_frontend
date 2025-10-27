import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockCardProps {
  stock: {
    symbol: string | { [key: string]: any } | null
    name: string
    price: number | null
    change: number | null
    changePercent: number | null
    volume?: number | null
  }
}

export function StockCard({ stock }: StockCardProps) {
  // ✅ Handle possible object or null symbol
  const symbol =
    typeof stock.symbol === "string"
      ? stock.symbol
      : stock.symbol && typeof stock.symbol === "object" && "symbol" in stock.symbol
      ? stock.symbol.symbol
      : "UNKNOWN"

  const price = Number(stock.price ?? 0)
  const change = Number(stock.change ?? 0)
  const changePercent = Number(stock.changePercent ?? 0)
  const volume = Number(stock.volume ?? 0)
  const isPositive = changePercent >= 0

  return (
    <Link href={`/stock/${encodeURIComponent(symbol)}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">{symbol}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{stock.name}</p>
            </div>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-success flex-shrink-0 ml-2" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive flex-shrink-0 ml-2" />
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">₹{price.toFixed(2)}</span>
              <Badge
                variant={isPositive ? "default" : "destructive"}
                className={cn(isPositive && "bg-success")}
              >
                {isPositive ? "+" : ""}
                {changePercent.toFixed(2)}%
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {typeof change === "number"
                ? `${isPositive ? "+" : ""}₹${change.toFixed(2)} today`
                : `${isPositive ? "+" : ""}${changePercent.toFixed(2)}% today`}
            </div>
            {volume > 0 && (
              <div className="text-xs text-muted-foreground">
                Volume: {volume.toLocaleString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
