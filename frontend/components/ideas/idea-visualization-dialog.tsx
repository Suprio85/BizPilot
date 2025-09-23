"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

type Idea = {
  id: number
  title: string
  category?: string
  successScore?: number
}

interface IdeaVisualizationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  idea: Idea | null
}

// Lightweight mock data derived from the idea for demo. In real app, fetch from backend.
const makeMockKpis = (idea?: Idea | null) => [
  { name: "Q1", revenue: 12, cost: 7, profit: 5 },
  { name: "Q2", revenue: 16, cost: 9, profit: 7 },
  { name: "Q3", revenue: 21, cost: 12, profit: 9 },
  { name: "Q4", revenue: 27, cost: 15, profit: 12 },
]

const makeChannelSplit = (idea?: Idea | null) => [
  { name: "Organic", value: 36 },
  { name: "Paid", value: 24 },
  { name: "Partnerships", value: 18 },
  { name: "Referrals", value: 22 },
]

export function IdeaVisualizationDialog({ open, onOpenChange, idea }: IdeaVisualizationDialogProps) {
  const kpis = makeMockKpis(idea)
  const split = makeChannelSplit(idea)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {idea ? `Visualizations • ${idea.title}` : "Visualizations"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="kpis" className="mt-2">
          <TabsList>
            <TabsTrigger value="kpis">KPIs</TabsTrigger>
            <TabsTrigger value="trend">Trend</TabsTrigger>
            <TabsTrigger value="split">Channel Split</TabsTrigger>
          </TabsList>

          <TabsContent value="kpis" className="mt-4">
            <Card className="border-border">
              <CardContent className="p-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={kpis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="cost" fill="#ef4444" name="Cost" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trend" className="mt-4">
            <Card className="border-border">
              <CardContent className="p-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kpis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue" strokeWidth={2} />
                    <Line type="monotone" dataKey="cost" stroke="#ef4444" name="Cost" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" name="Profit" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="split" className="mt-4">
            <Card className="border-border">
              <CardContent className="p-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend />
                    <Pie data={split} dataKey="value" nameKey="name" outerRadius={110} label />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default IdeaVisualizationDialog
