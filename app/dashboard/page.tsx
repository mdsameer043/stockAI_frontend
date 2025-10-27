"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { StockSearch } from "@/components/stock-search";
import { StockCard } from "@/components/stock-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { requireAuth } from "@/lib/auth";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Authentication check
  useEffect(() => {
    const u = requireAuth();
    setUser(u);
    setAuthLoading(false);
  }, []);

  // ✅ Fetch and auto-refresh market data
  useEffect(() => {
    if (!user) return;

    const fetchStocks = async () => {
      try {
        const response = await fetch("/api/stocks/market-overview");
        const data = await response.json();
        setTopGainers(data.topGainers || []);
        setTopLosers(data.topLosers || []);
        setTrending(data.trending || []);
      } catch (error) {
        console.error("Error fetching stocks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 30000); // 🔁 refresh every 30 sec
    return () => clearInterval(interval);
  }, [user]);

  if (authLoading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ✨ Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-6 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold tracking-tight">
            Market Overview
          </h1>
          <p className="mt-2 text-indigo-100 text-sm md:text-base">
            Welcome, <span className="font-semibold">{user.name}</span>. Explore live market data and get AI-powered insights for smarter investing.
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StockSearch />
        </motion.div>

        {/* 📊 Market Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Top Gainers",
              icon: <TrendingUp className="h-5 w-5 text-green-600" />,
              value: topGainers.length,
              desc: "Stocks up today",
              color: "from-green-100 to-green-50 border-green-200",
            },
            {
              title: "Top Losers",
              icon: <TrendingDown className="h-5 w-5 text-red-600" />,
              value: topLosers.length,
              desc: "Stocks down today",
              color: "from-red-100 to-red-50 border-red-200",
            },
            {
              title: "Trending",
              icon: <Activity className="h-5 w-5 text-blue-600" />,
              value: trending.length,
              desc: "Most searched stocks",
              color: "from-blue-100 to-blue-50 border-blue-200",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
            >
              <Card
                className={`bg-gradient-to-b ${stat.color} shadow-md border`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    {stat.title}
                  </CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 🧩 Tabs for Stock Lists */}
        <Tabs defaultValue="gainers" className="space-y-4">
          <TabsList className="flex gap-4 bg-slate-100 rounded-xl p-2">
            <TabsTrigger
              value="gainers"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
            >
              Top Gainers
            </TabsTrigger>
            <TabsTrigger
              value="losers"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
            >
              Top Losers
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
            >
              Trending
            </TabsTrigger>
          </TabsList>

          {/* 🔼 Top Gainers */}
          <TabsContent value="gainers">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading stocks...
              </div>
            ) : topGainers.length > 0 ? (
              <motion.div
                layout
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {topGainers.map((stock) => (
                  <motion.div
                    key={stock.symbol}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StockCard stock={stock} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No data available
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 🔽 Top Losers */}
          <TabsContent value="losers">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading stocks...
              </div>
            ) : topLosers.length > 0 ? (
              <motion.div
                layout
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {topLosers.map((stock) => (
                  <motion.div
                    key={stock.symbol}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StockCard stock={stock} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No data available
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 📈 Trending Stocks */}
          <TabsContent value="trending">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading stocks...
              </div>
            ) : trending.length > 0 ? (
              <motion.div
                layout
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {trending.map((stock) => (
                  <motion.div
                    key={stock.symbol}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StockCard stock={stock} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No data available
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
