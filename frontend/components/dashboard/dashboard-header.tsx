"use client"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, Menu, Plus, Search, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm"  onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search ideas, models, insights..." className="pl-10 w-80" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/ideas/new">
            <Button size="sm" className="glow-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Idea
            </Button>
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <Avatar className="w-8 h-8">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </Avatar>
            <div className="hidden md:block text-sm">
              <div className="font-medium">{user?.name || "User"}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.plan || "free"} plan</div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
