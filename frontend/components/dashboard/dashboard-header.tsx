"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search, Bell, Plus } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
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
        </div>
      </div>
    </header>
  )
}
