"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  CreditCard,
  Crown,
  Home,
  Lightbulb,
  MessageSquare,
  Settings,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "My Ideas", href: "/dashboard/ideas", icon: Lightbulb },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, premium: true },
  { name: "AI Chat", href: "/dashboard/chat", icon: MessageSquare },
  { name: "Daily Updates", href: "/dashboard/daily-updates", icon: BarChart3 },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Learning", href: "/dashboard/learning", icon: BookOpen },
]

const bottomNavigation = [
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const [user] = useState({ name: "John Doe", plan: "Free" })

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => onOpenChange(false)}>
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Logo />
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  size="sm"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                  {item.premium && (
                    <Badge variant="secondary" className="ml-auto">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-border space-y-2">
            {/* Upgrade prompt */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Upgrade to Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Unlock advanced features and unlimited business models
              </p>
              <Button size="sm" className="w-full">
                Upgrade Now
              </Button>
            </div>

            {bottomNavigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  size="sm"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Button>
              </Link>
            ))}

            {/* User info */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.plan} Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
