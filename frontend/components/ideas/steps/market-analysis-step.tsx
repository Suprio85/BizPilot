"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface MarketAnalysisStepProps {
  formData: any
  setFormData: (data: any) => void
}

export function MarketAnalysisStep({ formData, setFormData }: MarketAnalysisStepProps) {
  const [competitors, setCompetitors] = useState(formData.competitors || [""])

  const addCompetitor = () => {
    const newCompetitors = [...competitors, ""]
    setCompetitors(newCompetitors)
    setFormData({ ...formData, competitors: newCompetitors })
  }

  const removeCompetitor = (index: number) => {
    const newCompetitors = competitors.filter((_: string, i: number) => i !== index)
    setCompetitors(newCompetitors)
    setFormData({ ...formData, competitors: newCompetitors })
  }

  const updateCompetitor = (index: number, value: string) => {
    const newCompetitors = [...competitors]
    newCompetitors[index] = value
    setCompetitors(newCompetitors)
    setFormData({ ...formData, competitors: newCompetitors })
  }

  return (
    <div className="space-y-6">
      {/* Market Size */}
      <div className="space-y-2">
        <Label htmlFor="marketSize">Market Size & Opportunity</Label>
        <Textarea
          id="marketSize"
          placeholder="Describe the size of your target market, growth trends, and market opportunity..."
          value={formData.marketSize || ""}
          onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Competitors */}
      <div className="space-y-2">
        <Label>Key Competitors</Label>
        <div className="space-y-3">
          {competitors.map((competitor: string, index: number) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Competitor ${index + 1} (e.g., Company name or description)`}
                value={competitor}
                onChange={(e) => updateCompetitor(index, e.target.value)}
              />
              {competitors.length > 1 && (
                <Button type="button" variant="outline" size="sm" onClick={() => removeCompetitor(index)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addCompetitor} className="w-full bg-transparent">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Competitor
          </Button>
        </div>
      </div>

      {/* Competitive Advantage */}
      <div className="space-y-2">
        <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
        <Textarea
          id="competitiveAdvantage"
          placeholder="How will you differentiate from competitors? What advantages do you have?"
          value={formData.competitiveAdvantage || ""}
          onChange={(e) => setFormData({ ...formData, competitiveAdvantage: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Market Entry Strategy */}
      <div className="space-y-2">
        <Label htmlFor="marketEntry">Market Entry Strategy</Label>
        <Textarea
          id="marketEntry"
          placeholder="How do you plan to enter the market and acquire your first customers?"
          value={formData.marketEntry || ""}
          onChange={(e) => setFormData({ ...formData, marketEntry: e.target.value })}
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
