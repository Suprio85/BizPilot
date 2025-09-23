"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "./sidebar"
import { DashboardHeader } from "./dashboard-header"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("bizpilot_user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <div className="lg:pl-72 min-h-screen flex flex-col">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
