"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TrendingUp, LayoutDashboard, Star, User, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { logout, requireAuth } from "@/lib/auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = requireAuth()
    setUser(userData)
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Watchlist", href: "/watchlist", icon: Star },
    { name: "Profile", href: "/profile", icon: User },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background overflow-x-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT: Logo + Nav */}
          <div className="flex items-center gap-6 min-w-0">
            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">StockAI</span>
            </Link>

            {/* NAV LINKS (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      size="sm"
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "gap-1 font-medium",
                        pathname === item.href && "bg-secondary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* RIGHT: User Info + Logout + Menu */}
          <div className="flex items-center gap-4 shrink-0">
            {user && (
              <span className="hidden sm:inline text-sm text-muted-foreground whitespace-nowrap">
                Hi, {user.name}
              </span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={logout}
              className="hidden md:flex font-medium"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>

            {/* MOBILE MENU */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        pathname === item.href && "bg-secondary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                )
              })}
              <Button
                size="sm"
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN BODY */}
      <main className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Optional top section background card */}
          <div className="bg-card shadow-sm rounded-xl p-6 border border-border/50">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
