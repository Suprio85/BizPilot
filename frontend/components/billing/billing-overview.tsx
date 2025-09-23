"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Crown,
  Calendar,
  Download,
  Settings,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Users,
  AlertCircle,
} from "lucide-react"

const currentPlan = {
  name: "Free",
  price: "$0",
  period: "forever",
  features: ["2 business models per idea", "3-month forecasts", "Basic AI chat (50 messages/month)"],
  usage: {
    ideas: { used: 2, limit: 3 },
    models: { used: 4, limit: 6 },
    aiMessages: { used: 23, limit: 50 },
  },
}

const billingHistory = [
  {
    id: "inv_001",
    date: "2024-01-15",
    description: "Pro Plan - Monthly",
    amount: "$9.99",
    status: "paid",
  },
  {
    id: "inv_002",
    date: "2023-12-15",
    description: "Pro Plan - Monthly",
    amount: "$9.99",
    status: "paid",
  },
  {
    id: "inv_003",
    date: "2023-11-15",
    description: "Pro Plan - Monthly",
    amount: "$9.99",
    status: "paid",
  },
]

export function BillingOverview() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Billing & Usage</h1>
          <p className="text-muted-foreground mt-1">Manage your subscription and monitor your usage.</p>
        </div>
        <Button className="glow-primary">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Current Plan
                  </CardTitle>
                  <CardDescription>Your active subscription details</CardDescription>
                </div>
                <Badge variant="outline">{currentPlan.name}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{currentPlan.name} Plan</h3>
                  <p className="text-muted-foreground">
                    {currentPlan.price}/{currentPlan.period}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Next billing</p>
                  <p className="font-medium">No billing required</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Plan Features</h4>
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Plan
                </Button>
                <Button className="flex-1 glow-primary">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Usage This Month
              </CardTitle>
              <CardDescription>Track your current usage against plan limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ideas Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Ideas</span>
                  <span className="text-foreground">
                    {currentPlan.usage.ideas.used} / {currentPlan.usage.ideas.limit}
                  </span>
                </div>
                <Progress
                  value={(currentPlan.usage.ideas.used / currentPlan.usage.ideas.limit) * 100}
                  className="h-2"
                />
              </div>

              {/* Models Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Business Models Generated</span>
                  <span className="text-foreground">
                    {currentPlan.usage.models.used} / {currentPlan.usage.models.limit}
                  </span>
                </div>
                <Progress
                  value={(currentPlan.usage.models.used / currentPlan.usage.models.limit) * 100}
                  className="h-2"
                />
              </div>

              {/* AI Messages Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Chat Messages</span>
                  <span className="text-foreground">
                    {currentPlan.usage.aiMessages.used} / {currentPlan.usage.aiMessages.limit}
                  </span>
                </div>
                <Progress
                  value={(currentPlan.usage.aiMessages.used / currentPlan.usage.aiMessages.limit) * 100}
                  className="h-2"
                />
              </div>

              {/* Usage Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Approaching Limit</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You're using 67% of your active ideas limit. Consider upgrading to Pro for unlimited ideas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account and billing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Methods
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download Invoices
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Referral Program
              </Button>
            </CardContent>
          </Card>

          {/* Upgrade Benefits */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Upgrade to Pro
              </CardTitle>
              <CardDescription>Unlock advanced features and unlimited usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Unlimited business models</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>Unlimited AI chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>24-month forecasts</span>
                </div>
              </div>
              <Button className="w-full">Start 14-Day Free Trial</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Billing History */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your past invoices and payments</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{invoice.description}</h4>
                    <p className="text-sm text-muted-foreground">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                  <span className="font-medium text-foreground">{invoice.amount}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
