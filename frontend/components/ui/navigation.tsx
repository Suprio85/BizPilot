"use client"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "./logo"
import { Button } from "./button"
import { ThemeToggle } from "./theme-toggle"
import { Menu, X, Search } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/ai-chat" className="text-muted-foreground nav-link-hover transition-colors">
              AI Assistant
            </Link>
            <Link href="/platform" className="text-muted-foreground nav-link-hover transition-colors">
              Platform Overview
            </Link>
            <Link href="/pricing" className="text-muted-foreground nav-link-hover transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-muted-foreground nav-link-hover transition-colors">
              Documentation
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="btn-ghost-hover">
              <Search className="w-4 h-4" />
            </Button>
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="btn-ghost-hover">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="btn-primary-enhanced font-medium">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="btn-ghost-hover">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card border border-border rounded-lg mt-2">
              <Link href="/ai-chat" className="block px-3 py-2 text-muted-foreground nav-link-hover">
                AI Assistant
              </Link>
              <Link href="/platform" className="block px-3 py-2 text-muted-foreground nav-link-hover">
                Platform Overview
              </Link>
              <Link href="/pricing" className="block px-3 py-2 text-muted-foreground nav-link-hover">
                Pricing
              </Link>
              <Link href="/docs" className="block px-3 py-2 text-muted-foreground nav-link-hover">
                Documentation
              </Link>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <div className="flex justify-center py-2">
                  <ThemeToggle />
                </div>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="w-full btn-ghost-hover">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="w-full btn-primary-enhanced font-medium">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
