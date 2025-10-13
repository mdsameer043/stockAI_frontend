import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockCardProps {
  stock: {
    symbol: string
    name: string
    price: number
    change: number
    changePercent: number
    volume?: number
  }
}

export function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.changePercent >= 0

  return (
    <Link href={`/stock/${stock.symbol}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg">{stock.symbol}</CardTitle>
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
              <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
              <Badge variant={isPositive ? "default" : "destructive"} className={cn(isPositive && "bg-success")}>
                {isPositive ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {isPositive ? "+" : ""}${stock.change.toFixed(2)} today
            </div>
            {stock.volume && (
              <div className="text-xs text-muted-foreground">Volume: {stock.volume.toLocaleString()}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
