"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  TrendingUp,
  MessageSquare,
  Clock,
  ArrowRight,
  BarChart3,
  Users,
  Target,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

const recentIdeas = [
  {
    id: 1,
    title: "Eco-Friendly Packaging Solutions",
    description: "Biodegradable packaging for e-commerce businesses in Dhaka",
    status: "analyzing",
    progress: 75,
    models: 2,
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    title: "AI-Powered Language Learning",
    description: "Personalized Bengali language learning app for professionals",
    status: "completed",
    progress: 100,
    models: 3,
    lastUpdated: "1 day ago",
  },
  {
    id: 3,
    title: "Urban Farming Marketplace",
    description: "Connect urban farmers with local restaurants and consumers",
    status: "draft",
    progress: 25,
    models: 1,
    lastUpdated: "3 days ago",
  },
]

const stats = [
  { name: "Total Ideas", value: "12", change: "+3", icon: Lightbulb },
  { name: "Business Models", value: "28", change: "+8", icon: BarChart3 },
  { name: "AI Interactions", value: "156", change: "+24", icon: MessageSquare },
  { name: "Success Score", value: "87%", change: "+5%", icon: Target },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your business ideas today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ideas */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Ideas</CardTitle>
                  <CardDescription>Your latest business concepts and their progress</CardDescription>
                </div>
                <Link href="/dashboard/ideas">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentIdeas.map((idea) => (
                <div key={idea.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{idea.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{idea.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {idea.models} models
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {idea.lastUpdated}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        idea.status === "completed" ? "default" : idea.status === "analyzing" ? "secondary" : "outline"
                      }
                    >
                      {idea.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">{idea.progress}%</span>
                    </div>
                    <Progress value={idea.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & AI Chat */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to accelerate your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/ideas/new">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Create New Idea
                </Button>
              </Link>
              <Link href="/dashboard/chat">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/dashboard/community">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Assistant Preview */}
          <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                AI Assistant
              </CardTitle>
              <CardDescription>Get instant help with your business questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg p-3 mb-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  "How can I validate my eco-friendly packaging idea in the Dhaka market?"
                </p>
              </div>
              <Link href="/dashboard/chat">
                <Button className="w-full">
                  Start Conversation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
