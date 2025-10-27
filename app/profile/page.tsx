"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, TrendingUp, Target, Award, Briefcase, Settings } from "lucide-react"
import { requireAuth } from "@/lib/auth"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const userData = requireAuth()
    setUser(userData)

    const fetchData = async () => {
      try {
        const [portfolioRes, statsRes] = await Promise.all([fetch("/api/portfolio"), fetch("/api/user/stats")])
        const portfolioData = await portfolioRes.json()
        const statsData = await statsRes.json()
        setPortfolio(portfolioData.portfolio || [])
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching profile data:", error)
      }
    }

    fetchData()
  }, [])

  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0)
  const totalGain = portfolio.reduce((sum, item) => sum + item.gain, 0)
  const totalGainPercent = totalValue > 0 ? (totalGain / (totalValue - totalGain)) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-md">
          <h1 className="text-3xl font-bold tracking-tight">Profile Overview</h1>
          <p className="text-sm opacity-80 mt-1">
            Manage your account, track performance, and view predictions
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex flex-wrap justify-start bg-muted p-2 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Portfolio
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* ------------------ OVERVIEW TAB ------------------ */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-blue-500" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-semibold">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-lg font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="text-lg font-semibold">Free</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Total Predictions",
                  icon: <TrendingUp className="h-5 w-5 text-indigo-500" />,
                  value: stats?.totalPredictions || 0,
                  desc: "AI predictions generated",
                },
                {
                  title: "Accuracy Rate",
                  icon: <Target className="h-5 w-5 text-green-500" />,
                  value: `${stats?.accuracyRate || 0}%`,
                  desc: "Prediction accuracy",
                },
                {
                  title: "Watchlist Size",
                  icon: <Award className="h-5 w-5 text-yellow-500" />,
                  value: stats?.watchlistSize || 0,
                  desc: "Stocks tracked",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="hover:shadow-md transition-all duration-300 border-l-4 border-primary"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    {item.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ------------------ PORTFOLIO TAB ------------------ */}
          <TabsContent value="portfolio" className="space-y-6">
            {/* Portfolio Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Total Value", value: `$${totalValue.toFixed(2)}` },
                {
                  label: "Total Gain/Loss",
                  value: `${totalGain >= 0 ? "+" : ""}$${totalGain.toFixed(2)}`,
                  color: totalGain >= 0 ? "text-green-500" : "text-red-500",
                },
                {
                  label: "Return",
                  value: `${totalGainPercent >= 0 ? "+" : ""}${totalGainPercent.toFixed(2)}%`,
                  color: totalGainPercent >= 0 ? "text-green-500" : "text-red-500",
                },
              ].map((item, i) => (
                <Card key={i} className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-semibold ${item.color || ""}`}>{item.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Holdings */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" /> Holdings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.map((holding) => (
                      <div
                        key={holding.symbol}
                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-all"
                      >
                        <div>
                          <p className="font-semibold">{holding.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {holding.shares} shares @ ${holding.avgPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${holding.value.toFixed(2)}</p>
                          <p
                            className={`text-sm ${
                              holding.gain >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {holding.gain >= 0 ? "+" : ""}
                            ${holding.gain.toFixed(2)} ({holding.gainPercent.toFixed(2)}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No holdings yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ------------------ SETTINGS TAB ------------------ */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" /> Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} disabled />
                  </div>
                </div>
                <Button className="mt-4">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
