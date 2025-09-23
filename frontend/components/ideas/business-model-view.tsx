"use client"

import { AIChat } from "@/components/chat/ai-chat"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BusinessModelViewProps {
  ideaId: string
  modelId: string
}

// Mock idea & models; replace with real data fetching by ideaId/modelId
const mockIdea = {
  id: "1",
  title: "Eco-Friendly Packaging Solutions",
  category: "sustainability",
  businessModels: [
    {
      id: 1,
      name: "Subscription Model",
      description: "Monthly subscription for packaging supplies",
      revenue: "$50K/month projected",
      profitMargin: "35%",
      timeToBreakeven: "8 months",
      riskLevel: "Medium",
    },
    {
      id: 2,
      name: "Direct Sales Model",
      description: "One-time sales with bulk discounts",
      revenue: "$30K/month projected",
      profitMargin: "28%",
      timeToBreakeven: "12 months",
      riskLevel: "Low",
    },
    {
      id: 3,
      name: "Hybrid Model",
      description: "Mix of subscription and direct sales",
      revenue: "$42K/month projected",
      profitMargin: "32%",
      timeToBreakeven: "10 months",
      riskLevel: "Medium",
    },
  ],
}

function parseNumber(input: string) {
  if (!input) return 0
  const kMatch = input.match(/(\d+)(?=K)/i)
  if (kMatch) return Number(kMatch[1])
  const num = input.match(/\d+(?:\.\d+)?/)
  return num ? Number(num[0]) : 0
}

export function BusinessModelView({ ideaId, modelId }: BusinessModelViewProps) {
  const idea = mockIdea // fetch by ideaId
  const model = useMemo(() => idea.businessModels.find((m) => String(m.id) === String(modelId)), [modelId])
  const [tab, setTab] = useState("overview")

  if (!model) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Model not found</h1>
            <p className="text-muted-foreground mt-1">The requested business model does not exist.</p>
          </div>
          <Badge variant="outline">Idea #{idea.id}</Badge>
        </div>
        <Link href={`/dashboard/ideas/${ideaId}`}>
          <Button variant="outline">Back to Idea</Button>
        </Link>
      </div>
    )
  }

  const revenueK = parseNumber(model.revenue)
  const marginPct = parseNumber(model.profitMargin)

  // Simple synthetic trend per model
  const kpiTrend = [
    { month: "Jan", revenue: Math.max(8, revenueK - 10), cost: Math.max(4, revenueK - 15) },
    { month: "Feb", revenue: Math.max(10, revenueK - 8), cost: Math.max(5, revenueK - 13) },
    { month: "Mar", revenue: Math.max(12, revenueK - 6), cost: Math.max(6, revenueK - 12) },
    { month: "Apr", revenue: Math.max(14, revenueK - 4), cost: Math.max(7, revenueK - 10) },
    { month: "May", revenue: Math.max(16, revenueK - 2), cost: Math.max(8, revenueK - 9) },
  ]

  const seed = `You're evaluating the business model "${model.name}" for the idea "${idea.title}" (${idea.category}). Current metrics: revenue ${model.revenue}, margin ${model.profitMargin}, time to breakeven ${model.timeToBreakeven}, risk ${model.riskLevel}. Provide insights to improve pricing, reduce churn, and accelerate breakeven. Include a brief experiment plan.`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{model.name}</h1>
          <p className="text-muted-foreground mt-1">For idea: {idea.title}</p>
        </div>
        <Badge variant="outline">Idea #{idea.id} • Model #{model.id}</Badge>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="assistant">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Executive Summary */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>
                {model.description}. This page provides an in-depth overview of the {model.name.toLowerCase()} for “{idea.title}”.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                The {model.name.toLowerCase()} aims to deliver sustainable growth by aligning pricing, packaging, and customer
                retention strategies. Based on the initial projections, this model targets <span className="font-medium text-foreground">{model.revenue}</span>
                with margins around <span className="font-medium text-foreground">{model.profitMargin}</span> and an estimated breakeven at
                <span className="font-medium text-foreground"> {model.timeToBreakeven}</span>. Overall risk is assessed as
                <span className="font-medium text-foreground"> {model.riskLevel}</span> given the current market dynamics and operational
                considerations.
              </p>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{model.revenue}</div>
                <div className="text-xs text-muted-foreground">Projected Revenue</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{model.profitMargin}</div>
                <div className="text-xs text-muted-foreground">Profit Margin</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{model.timeToBreakeven}</div>
                <div className="text-xs text-muted-foreground">Break-even Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Value Proposition & Pricing Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Value Proposition</CardTitle>
                <CardDescription>Why customers choose this model</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Predictable supply and costs through recurring contracts</li>
                  <li>Eco-friendly packaging aligns with customer sustainability goals</li>
                  <li>Operational simplicity with bundled logistics and support</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Pricing Strategy</CardTitle>
                <CardDescription>How we charge and package</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tiered pricing based on monthly volume commitments</li>
                  <li>Annual prepay discount to improve cash flow and retention</li>
                  <li>Add-on fees for bespoke materials and expedited delivery</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Target Customers & Use Cases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Target Customers</CardTitle>
                <CardDescription>Who benefits most</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Mid-size e-commerce brands with predictable shipping volumes</li>
                  <li>Food delivery services optimizing for eco compliance</li>
                  <li>Retailers seeking local, sustainable packaging partners</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Primary Use Cases</CardTitle>
                <CardDescription>Where this model excels</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Recurring replenishment with SLA-based delivery windows</li>
                  <li>Co-branded packaging to enhance brand perception</li>
                  <li>Compliance-driven industries requiring material traceability</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Risks & Mitigations */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Risks & Mitigations</CardTitle>
              <CardDescription>Key risks for this model and how to mitigate them</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Risk Level: <span className="font-medium text-foreground">{model.riskLevel}</span> — Introduce supplier
                  diversification and index-linked pricing to reduce volatility.
                </li>
                <li>Implement quarterly renegotiation clauses for raw material fluctuations.</li>
                <li>Build a safety stock buffer and demand forecasting to stabilize lead times.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Assumptions & Next Steps */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Assumptions & Next Steps</CardTitle>
              <CardDescription>What must be true and how we validate</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Assume customer willingness to pay premium for sustainability credentials.</li>
                <li>Pilot with 3 target accounts to validate churn and delivery SLAs.</li>
                <li>Run price-sensitivity tests across two tiers to optimize margin vs. conversion.</li>
              </ul>
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setTab("assistant")}>Open AI Assistant</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>KPI Trend</CardTitle>
              <CardDescription>Revenue and cost over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpiTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue (K/mo)" strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke="#ef4444" name="Cost (K/mo)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Snapshot</CardTitle>
              <CardDescription>Revenue vs Margin</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: model.name, revenue: revenueK, margin: marginPct }] }>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue (K/mo)" fill="#10b981" />
                  <Bar dataKey="margin" name="Margin (%)" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistant" className="space-y-4">
          <AIChat seedPrompt={seed} title={`${model.name} Assistant`} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Link href={`/dashboard/ideas/${ideaId}`}>
          <Button variant="outline">Back to Idea</Button>
        </Link>
      </div>
    </div>
  )
}

export default BusinessModelView
