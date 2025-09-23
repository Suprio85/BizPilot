"use client"

import IdeaVisualizationDialog from "@/components/ideas/idea-visualization-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Clock, Edit, Eye, Lightbulb, MoreHorizontal, Plus, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const mockIdeas = [
  {
    id: 1,
    title: "Eco-Friendly Packaging Solutions",
    description: "Biodegradable packaging for e-commerce businesses in Dhaka",
    category: "sustainability",
    status: "analyzing",
    progress: 75,
    models: 2,
    lastUpdated: "2 hours ago",
    successScore: 87,
  },
  {
    id: 2,
    title: "AI-Powered Language Learning",
    description: "Personalized Bengali language learning app for professionals",
    category: "education",
    status: "completed",
    progress: 100,
    models: 3,
    lastUpdated: "1 day ago",
    successScore: 92,
  },
  {
    id: 3,
    title: "Urban Farming Marketplace",
    description: "Connect urban farmers with local restaurants and consumers",
    category: "food",
    status: "draft",
    progress: 25,
    models: 1,
    lastUpdated: "3 days ago",
    successScore: 78,
  },
  {
    id: 4,
    title: "Smart Home Energy Monitor",
    description: "IoT device to optimize household energy consumption",
    category: "technology",
    status: "completed",
    progress: 100,
    models: 4,
    lastUpdated: "5 days ago",
    successScore: 85,
  },
  {
    id: 5,
    title: "Artisan Craft Marketplace",
    description: "Platform connecting local artisans with global customers",
    category: "retail",
    status: "analyzing",
    progress: 60,
    models: 2,
    lastUpdated: "1 week ago",
    successScore: 81,
  },
]

export function IdeasList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [vizOpen, setVizOpen] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<any | null>(null)

  const filteredIdeas = mockIdeas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || idea.status === statusFilter
    const matchesCategory = categoryFilter === "all" || idea.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "analyzing":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  const getSuccessScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Business Ideas</h1>
          <p className="text-muted-foreground mt-1">Manage and track your business concepts and their development.</p>
        </div>
        <Link href="/dashboard/ideas/new">
          <Button className="glow-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Idea
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="analyzing">Analyzing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="food">Food & Beverage</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="border-border hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{idea.title}</CardTitle>
                  <CardDescription className="text-sm">{idea.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant={getStatusColor(idea.status)}>{idea.status}</Badge>
                <Badge variant="outline">{idea.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Analysis Progress</span>
                  <span className="text-foreground">{idea.progress}%</span>
                </div>
                <Progress value={idea.progress} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-foreground">{idea.models}</div>
                  <div className="text-xs text-muted-foreground">Models</div>
                </div>
                <div>
                  <div className={`text-lg font-semibold ${getSuccessScoreColor(idea.successScore)}`}>
                    {idea.successScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">Success Score</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    <Clock className="w-4 h-4 inline mr-1" />
                  </div>
                  <div className="text-xs text-muted-foreground">{idea.lastUpdated}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link href={`/dashboard/ideas/${idea.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedIdea(idea)
                    setVizOpen(true)
                  }}
                  title="Visualize data/models"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No ideas found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your filters or search terms."
                : "Start by creating your first business idea."}
            </p>
            <Link href="/dashboard/ideas/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create New Idea
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
      <IdeaVisualizationDialog open={vizOpen} onOpenChange={setVizOpen} idea={selectedIdea} />
    </div>
  )
}
