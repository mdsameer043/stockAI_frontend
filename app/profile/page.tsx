"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, TrendingUp, Target, Award } from "lucide-react"
import { requireAuth } from "@/lib/auth"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [portfolio, setPortfolio] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const userData = requireAuth()
    setUser(userData)

    // Fetch portfolio and stats
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account and view your portfolio performance</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="text-lg font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-lg font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="text-lg font-medium">Free</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalPredictions || 0}</div>
                  <p className="text-xs text-muted-foreground">AI predictions generated</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.accuracyRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">Prediction accuracy</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Watchlist Size</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.watchlistSize || 0}</div>
                  <p className="text-xs text-muted-foreground">Stocks tracked</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {/* Portfolio Summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Gain/Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalGain >= 0 ? "text-success" : "text-destructive"}`}>
                    {totalGain >= 0 ? "+" : ""}${totalGain.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalGainPercent >= 0 ? "text-success" : "text-destructive"}`}>
                    {totalGainPercent >= 0 ? "+" : ""}
                    {totalGainPercent.toFixed(2)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Holdings */}
            <Card>
              <CardHeader>
                <CardTitle>Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <div className="space-y-4">
                    {portfolio.map((holding) => (
                      <div key={holding.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{holding.symbol}</p>
                          <p className="text-sm text-muted-foreground">
                            {holding.shares} shares @ ${holding.avgPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${holding.value.toFixed(2)}</p>
                          <p className={`text-sm ${holding.gain >= 0 ? "text-success" : "text-destructive"}`}>
                            {holding.gain >= 0 ? "+" : ""}${holding.gain.toFixed(2)} ({holding.gainPercent.toFixed(2)}%)
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

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} disabled />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
