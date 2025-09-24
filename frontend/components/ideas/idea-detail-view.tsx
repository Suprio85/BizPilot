"use client"

import { AIChat } from "@/components/chat/ai-chat"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatMarketSize, getIdea, StoredIdea } from "@/lib/ideas-store"
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Crown,
  DollarSign,
  Download,
  Edit,
  Share,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface IdeaDetailViewProps {
  ideaId: string
}

export function IdeaDetailView({ ideaId }: IdeaDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [idea, setIdea] = useState<StoredIdea | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const stored = getIdea(ideaId)
    if (!stored) {
      setNotFound(true)
    } else {
      setIdea(stored)
    }
  }, [ideaId])

  const getSuccessScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "Low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/ideas">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Back to Ideas</Button>
        </Link>
        <Card className="border-border"><CardContent className="p-8 text-center"><h2 className="text-xl font-semibold mb-2">Idea not found</h2><p className="text-muted-foreground mb-4">It may have been cleared or not generated this session.</p><Link href="/dashboard/ideas/new"><Button>Create new idea</Button></Link></CardContent></Card>
      </div>
    )
  }

  if (!idea) return <div className="p-8 text-muted-foreground">Loading...</div>

  const marketSizeDisplay = formatMarketSize(idea.marketAnalysis.marketSizeUSD)
  const growthRateDisplay = `${idea.marketAnalysis.growthRatePct}% annually`
  const progress = 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ideas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Ideas
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{idea.title}</h1>
            <p className="text-muted-foreground mt-1">Created {new Date(idea.createdAt).toLocaleDateString()} • Updated {new Date(idea.lastUpdated).toLocaleTimeString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/ideas/${idea.id}/models`}>
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Models & Analytics
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status and Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <div className={`text-3xl font-bold ${getSuccessScoreColor(idea.successScore)} mb-2`}>{idea.successScore}%</div>
            <p className="text-sm text-muted-foreground">Success Score</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-foreground mb-2">{marketSizeDisplay}</div>
            <p className="text-sm text-muted-foreground">Market Size</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-foreground mb-2">{idea.businessModels.length}</div>
            <p className="text-sm text-muted-foreground">Business Models</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <Badge variant={idea.status === 'completed' ? 'default' : 'secondary'} className="mb-2">{idea.status}</Badge>
            <p className="text-sm text-muted-foreground">Analysis Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Business Models</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="risks">Risks & Opportunities</TabsTrigger>
          <TabsTrigger value="financials">
            <Crown className="w-4 h-4 mr-1" />
            Financials
          </TabsTrigger>
          <TabsTrigger value="assistant">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Idea Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{idea.description}</p>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Opportunity:</span><span className="text-foreground">{idea.marketAnalysis.marketOpportunity}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Competitors:</span><span className="text-foreground">{idea.marketAnalysis.competitorCount}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Growth:</span><span className="text-foreground">{growthRateDisplay}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Target:</span><span className="text-foreground max-w-[160px] text-right">{idea.marketAnalysis.targetCustomers}</span></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Market Overview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Size:</span><span>{marketSizeDisplay}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Growth:</span><span>{growthRateDisplay}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Competitors:</span><span>{idea.marketAnalysis.competitorCount}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Opportunity:</span><span>{idea.marketAnalysis.marketOpportunity}</span></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Analysis Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="text-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Market research completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Business models generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Risk assessment done</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Financial projections ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-sm mb-1">AI Recommendation</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      This idea shows strong potential. Consider the subscription model for better recurring revenue.
                    </p>
                    <Button size="sm" className="w-full">
                      View Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>Compare revenue and margin across business models</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={idea.businessModels.map((m) => ({
                  name: m.name,
                  revenue: m.revenueK,
                  margin: m.marginPct,
                }))}>
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

          <div className="grid gap-6">
            {idea.businessModels.map((model) => (
              <Card key={model.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        model.riskLevel === "Low"
                          ? "default"
                          : model.riskLevel === "Medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {model.riskLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{model.revenueDisplay}</div>
                      <div className="text-xs text-muted-foreground">Projected Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{model.profitMargin}</div>
                      <div className="text-xs text-muted-foreground">Profit Margin</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{model.timeToBreakeven}</div>
                      <div className="text-xs text-muted-foreground">Break-even Time</div>
                    </div>
                    <div className="text-center">
                      <div className="grid grid-cols-1 gap-2">
                        <Link href={`/dashboard/ideas/${idea.id}/models/${model.id}`}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Open Model Page
                          </Button>
                        </Link>
                        <Link
                          href={{
                            pathname: `/dashboard/ideas/${idea.id}/models`,
                            query: {
                              tab: "assistant",
                              seed: `Focus on the ${model.name} for ${idea.title}. Current metrics: revenue ${model.revenueDisplay}, margin ${model.profitMargin}, break-even ${model.timeToBreakeven}. Suggest improvements and risks to watch.`,
                            },
                          }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                            title="Ask AI to refine or modify this model"
                          >
                            Ask AI about this model
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
              <CardDescription>Comprehensive analysis of your target market and competitive landscape</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Target Customers</h4>
                <p className="text-muted-foreground">{idea.marketAnalysis.targetCustomers}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{marketSizeDisplay}</div>
                  <div className="text-sm text-muted-foreground">Total Market Size</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{growthRateDisplay}</div>
                  <div className="text-sm text-muted-foreground">Annual Growth</div>
                </div>
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-foreground">{idea.marketAnalysis.competitorCount}</div>
                  <div className="text-sm text-muted-foreground">Key Competitors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Risks
                </CardTitle>
                <CardDescription>Potential challenges and mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.risks.map((risk, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getRiskColor(risk.severity)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{risk.type} Risk</h4>
                      <Badge variant="outline" className="text-xs">
                        {risk.severity}
                      </Badge>
                    </div>
                    <p className="text-sm">{risk.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Opportunities
                </CardTitle>
                <CardDescription>Growth opportunities and strategic advantages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.opportunities.map((opportunity, index) => (
                  <div key={index} className="p-3 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-green-800">{opportunity.type} Opportunity</h4>
                      <Badge variant="outline" className="text-xs text-green-600">
                        {opportunity.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-green-700">{opportunity.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unlock Financial Projections</h3>
              <p className="text-muted-foreground mb-4">
                Get detailed financial forecasts, cash flow analysis, and investment requirements with Pro plan.
              </p>
              <Button className="glow-primary">Upgrade to Pro</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Chat assistant tab */}
        <TabsContent value="assistant" className="space-y-6">
          <AIChat />
        </TabsContent>
      </Tabs>
    </div>
  )
}
