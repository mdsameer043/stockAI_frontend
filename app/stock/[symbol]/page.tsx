"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StockChart } from "@/components/stock-chart";
import { PredictionHistory } from "@/components/prediction-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";
import { motion } from "framer-motion";

export default function StockDetailPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;

  const [stockData, setStockData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [predictionDays, setPredictionDays] = useState(1);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [modelError, setModelError] = useState(false);

  // 🧩 Load user (for watchlist)
  useEffect(() => {
    const userData = requireAuth();
    setUser(userData);
  }, []);

  // 📈 Fetch stock info
  const fetchStockData = async () => {
    try {
      const response = await fetch(`/api/stocks/${symbol}`);
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!symbol) return;
    fetchStockData();
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  // ⭐ Watchlist check
  useEffect(() => {
    const fetchWatchlistStatus = async () => {
      if (!user?._id || !symbol) return;
      try {
        const res = await fetch(`/api/watchlist/check?symbol=${symbol}`);
        const data = await res.json();
        setIsInWatchlist(data.exists);
      } catch (err) {
        console.error("Error checking watchlist:", err);
      }
    };
    fetchWatchlistStatus();
  }, [symbol, user]);

  // ⭐ Toggle watchlist
  const toggleWatchlist = async () => {
    try {
      if (isInWatchlist) {
        await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" });
        setIsInWatchlist(false);
      } else {
        await fetch(`/api/watchlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol }),
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    }
  };

  // 🤖 Predict from Flask
  const handlePredict = async () => {
    try {
      setShowPrediction(true);
      setModelError(false);

      const res = await fetch(
        `/api/predict?symbol=${symbol}&horizon=${predictionDays}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Model not running or failed");
      const data = await res.json();

      // ✅ Map Flask response
      setPredictionResult({
        trend: data.direction,
        confidence: data.confidence * 100,
        targetPrice: data.predicted_price,
        changePercent: data.change_percent,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      setModelError(true);
      setPredictionResult(null);
    }
  };

  // 🌀 Loading UI
  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock data...</p>
          </div>
        </div>
      </DashboardLayout>
    );

  // ❌ Stock not found
  if (!stockData)
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Stock not found</p>
          <Link href="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );

  const price = Number(stockData.price) || 0;
  const changePercent = Number(stockData.changePercent) || 0;
  const isPositive = changePercent >= 0;

  // 🎨 Render UI
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Back button */}
        <Button
          variant="ghost"
          className="mt-4 flex items-center gap-2 hover:bg-muted"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        {/* Stock Header */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold tracking-tight">
                {stockData.symbol}
              </h1>
              <Button
                variant="secondary"
                size="icon"
                onClick={toggleWatchlist}
                className={cn(
                  "bg-white/20 hover:bg-white/30 text-white",
                  isInWatchlist && "bg-yellow-400/90 text-yellow-900"
                )}
              >
                <Star
                  className={cn("h-5 w-5", isInWatchlist && "fill-current")}
                />
              </Button>
            </div>
            <p className="text-blue-100">{stockData.name}</p>
          </div>

          <div className="text-left md:text-right mt-4 md:mt-0">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-semibold">₹{price.toFixed(2)}</span>
              <Badge
                variant={isPositive ? "default" : "destructive"}
                className={cn(
                  "text-sm px-3 py-1",
                  isPositive ? "bg-green-500" : "bg-red-500"
                )}
              >
                {isPositive ? "+" : ""}
                {changePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <Card className="shadow-md border border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-700">
              Price Chart (10 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockChart
              symbol={symbol}
              historicalData={stockData.historicalData}
            />
          </CardContent>
        </Card>

        {/* AI Prediction Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden shadow-2xl border-none bg-gradient-to-br from-indigo-500/10 to-violet-500/10 backdrop-blur-md rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-5 shadow-md">
              <CardTitle className="text-2xl font-bold tracking-wide flex items-center gap-2">
                🤖 AI Stock Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input & Predict Button */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-xl bg-white/70 backdrop-blur-md shadow-md p-6 border border-slate-200"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  Predict for next (days):
                </p>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={predictionDays}
                  onChange={(e) => setPredictionDays(Number(e.target.value))}
                  className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <Button
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 transition-all"
                  onClick={handlePredict}
                >
                  Predict
                </Button>
              </motion.div>

              {/* Result Display */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-xl bg-gradient-to-br from-indigo-50 via-white to-violet-50 border border-indigo-100 shadow-lg flex flex-col items-center justify-center text-center p-8"
              >
                {modelError ? (
                  <p className="text-destructive font-medium text-lg">
                    ⚠️ Model not running
                  </p>
                ) : showPrediction && predictionResult ? (
                  <>
                    <h3 className="text-3xl font-extrabold text-indigo-700 mb-2">
                      {predictionResult.trend} Trend
                    </h3>
                    <p className="text-xl text-slate-700">
                      Target:{" "}
                      <span className="font-semibold text-indigo-600">
                        ₹{predictionResult.targetPrice.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Confidence: {predictionResult.confidence.toFixed(1)}%
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground text-lg">
                    Click “Predict” to see AI insights.
                  </p>
                )}
              </motion.div>

              {/* Model Info */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="rounded-xl bg-white/70 backdrop-blur-md shadow-md p-6 border border-slate-200"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  Model Information:
                </p>
                <div className="text-sm space-y-1">
                  <p>
                    Model: <span className="font-medium">AttCLX Attention</span>
                  </p>
                  <p>
                    Last Retrained:{" "}
                    <span className="font-medium">2 days ago</span>
                  </p>
                  <p>
                    Accuracy:{" "}
                    <span className="font-medium text-green-600">92.4%</span>
                  </p>
                  <p>
                    Mean Absolute Error:{" "}
                    <span className="font-medium text-blue-600">1.25%</span>
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Prediction History */}
        <PredictionHistory symbol={symbol} />
      </motion.div>
    </DashboardLayout>
  );
}
