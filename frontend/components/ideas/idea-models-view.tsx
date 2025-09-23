"use client"

import { AIChat } from "@/components/chat/ai-chat"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface IdeaModelsViewProps {
  ideaId: string
}

// Mock idea snapshot; replace with fetch by ideaId as needed
const mockIdea = {
  id: "1",
  title: "Eco-Friendly Packaging Solutions",
  category: "sustainability",
  businessModels: [
    { id: 1, name: "Subscription Model", revenue: 50, margin: 35, churn: 5 },
    { id: 2, name: "Direct Sales", revenue: 30, margin: 28, churn: 0 },
    { id: 3, name: "Hybrid", revenue: 42, margin: 32, churn: 3 },
  ],
}

const kpiTrend = [
  { month: "Jan", revenue: 12, cost: 7 },
  { month: "Feb", revenue: 15, cost: 8 },
  { month: "Mar", revenue: 18, cost: 10 },
  { month: "Apr", revenue: 22, cost: 12 },
  { month: "May", revenue: 28, cost: 15 },
]

export function IdeaModelsView({ ideaId }: IdeaModelsViewProps) {
  const idea = mockIdea
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "models"
  const [tab, setTab] = useState<string>(initialTab)
  const extraSeed = searchParams.get("seed") || ""
  const seed = useMemo(() => {
    const base = `You are helping refine business models for the idea "${idea.title}" in the ${idea.category} space. Suggest improvements to revenue model, pricing, and churn mitigation. Also propose a quick sensitivity analysis plan.`
    return extraSeed ? `${base}\n\nAdditional Context: ${extraSeed}` : base
  }, [idea.title, idea.category, extraSeed])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Models</h1>
          <p className="text-muted-foreground mt-1">Explore and refine models for: {idea.title}</p>
        </div>
        <Badge variant="outline">Idea #{idea.id}</Badge>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="assistant">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {idea.businessModels.map((m) => (
              <Card key={m.id} className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{m.name}</CardTitle>
                  <CardDescription>Revenue: ${m.revenue}K / mo • Margin: {m.margin}%</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">Churn: {m.churn}%</div>
                  <Button variant="outline" size="sm" className="bg-transparent">Refine with AI</Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke="#ef4444" name="Cost" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>Revenue vs Margin across models</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={idea.businessModels}>
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
          <AIChat seedPrompt={seed} title="AI Model Assistant" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default IdeaModelsView
