"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Calendar, Crown, DollarSign, Target, TrendingDown, TrendingUp } from "lucide-react"

const successScoreData = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 82 },
  { month: "Mar", score: 85 },
  { month: "Apr", score: 87 },
  { month: "May", score: 89 },
  { month: "Jun", score: 92 },
]

const categoryData = [
  { name: "Technology", value: 35, color: "#3b82f6" },
  { name: "Sustainability", value: 25, color: "#10b981" },
  { name: "Education", value: 20, color: "#f59e0b" },
  { name: "Food & Beverage", value: 12, color: "#ef4444" },
  { name: "Other", value: 8, color: "#8b5cf6" },
]

const ideaPerformance = [
  { name: "Eco Packaging", successScore: 92, marketSize: "Large", competition: "Medium" },
  { name: "AI Language Learning", success: 89, marketSize: "Medium", competition: "High" },
  { name: "Urban Farming", successScore: 85, marketSize: "Medium", competition: "Low" },
  { name: "Smart Energy Monitor", successScore: 87, marketSize: "Large", competition: "High" },
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your business ideas and performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Crown className="w-3 h-3 mr-1" />
            Pro Feature
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Success Score</p>
                <p className="text-2xl font-bold text-foreground">87%</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Market Value</p>
                <p className="text-2xl font-bold text-foreground">$2.4M</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ideas Analyzed</p>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-blue-600 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />3 this month
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time to Market</p>
                <p className="text-2xl font-bold text-foreground">8.2mo</p>
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  -1.2mo improvement
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Score Trend */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Success Score Trend</CardTitle>
            <CardDescription>Your ideas' success scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <LineChartLite data={successScoreData} />
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Ideas by Category</CardTitle>
            <CardDescription>Distribution of your business ideas across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <PieChartLite data={categoryData} size={220} thickness={44} />
              <div className="space-y-2">
                {categoryData.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
                    <span className="text-sm text-foreground">{d.name}</span>
                    <span className="text-sm text-muted-foreground ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Ideas */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Top Performing Ideas</CardTitle>
          <CardDescription>Your most promising business concepts based on AI analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ideaPerformance.map((idea, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{idea.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Market: {idea.marketSize}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Competition: {idea.competition}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{idea.successScore}%</div>
                  <div className="text-xs text-muted-foreground">Success Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt for Free Users */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Unlock Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Get deeper insights with competitor analysis, market forecasting, and custom reports.
                </p>
              </div>
            </div>
            <Button className="glow-primary">Upgrade to Pro</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Lightweight line chart using pure SVG
function LineChartLite({
  data,
  stroke = "#3b82f6",
}: {
  data: { month: string; score: number }[]
  stroke?: string
}) {
  const width = 600
  const height = 300
  const padding = 32
  const maxY = 100
  const minY = 0

  const xStep = data.length > 1 ? (width - padding * 2) / (data.length - 1) : width - padding * 2
  const points = data.map((d, i) => {
    const x = padding + i * xStep
    const y = padding + (1 - (d.score - minY) / (maxY - minY)) * (height - padding * 2)
    return { x, y }
  })

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ")

  const yTicks = [0, 20, 40, 60, 80, 100]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Grid */}
      {yTicks.map((t, idx) => {
        const y = padding + (1 - t / 100) * (height - padding * 2)
        return (
          <line
            key={idx}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="currentColor"
            className="text-border"
            strokeDasharray="3 3"
          />
        )
      })}

      {/* X labels */}
      {points.map((p, i) => (
        <text key={i} x={p.x} y={height - padding / 2} textAnchor="middle" className="text-[10px] fill-muted-foreground">
          {data[i].month}
        </text>
      ))}

      {/* Y labels */}
      {yTicks.map((t, i) => (
        <text
          key={i}
          x={padding - 8}
          y={padding + (1 - t / 100) * (height - padding * 2)}
          textAnchor="end"
          dominantBaseline="middle"
          className="text-[10px] fill-muted-foreground"
        >
          {t}
        </text>
      ))}

      {/* Line path */}
      <path d={path} fill="none" stroke={stroke} strokeWidth={2} />

      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={stroke} />
      ))}
    </svg>
  )
}

// Lightweight pie/donut chart using CSS conic-gradient
function PieChartLite({
  data,
  size = 220,
  thickness = 40,
}: {
  data: { name: string; value: number; color: string }[]
  size?: number
  thickness?: number
}) {
  const total = data.reduce((acc, d) => acc + d.value, 0)
  let current = 0
  const segments = data
    .map((d) => {
      const start = (current / total) * 360
      current += d.value
      const end = (current / total) * 360
      return `${d.color} ${start}deg ${end}deg`
    })
    .join(", ")

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    background: `conic-gradient(${segments})`,
    position: "relative",
  }

  const holeSize = size - thickness * 2
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div style={style} />
      <div
        className="absolute rounded-full flex items-center justify-center text-sm text-muted-foreground"
        style={{
          width: holeSize,
          height: holeSize,
          left: thickness,
          top: thickness,
          background: "hsl(var(--card))",
          boxShadow: "inset 0 0 0 1px hsl(var(--border))",
        }}
      >
        {total}%
      </div>
    </div>
  )
}
