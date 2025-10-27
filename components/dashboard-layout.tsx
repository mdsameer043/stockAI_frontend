"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  TrendingUp,
  LayoutDashboard,
  Star,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { logout, requireAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = requireAuth()
    setUser(userData)
  }, [])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Watchlist", href: "/watchlist", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT: Logo + Nav */}
          <div className="flex items-center gap-6 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 shrink-0 group"
            >
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight group-hover:text-blue-700 transition-colors">
                StockAI
              </span>
            </Link>

            {/* NAV LINKS (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      size="sm"
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "gap-2 font-medium rounded-lg px-3 transition-all duration-200",
                        active
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "hover:bg-gray-100 text-gray-700"
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

          {/* RIGHT: Profile Dropdown + Mobile Menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Profile Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm hover:shadow transition-all duration-200">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
                      <User className="h-4 w-4" />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44 mt-2 shadow-lg border border-gray-100 rounded-lg">
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer flex items-center gap-2 hover:bg-blue-50"
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer flex items-center gap-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
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

        {/* MOBILE NAV */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm shadow-sm">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      variant={active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 rounded-md text-gray-700 transition-all",
                        active
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "hover:bg-gray-100"
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
                className="w-full justify-start gap-3 text-gray-600 hover:bg-red-50 hover:text-red-600"
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
          <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100">
            {children}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-white/60 backdrop-blur-sm py-3 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} <span className="font-semibold text-blue-700">StockAI</span>. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
