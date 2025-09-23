"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IdeaDetailsStepProps {
  formData: any
  setFormData: (data: any) => void
}

export function IdeaDetailsStep({ formData, setFormData }: IdeaDetailsStepProps) {
  return (
    <div className="space-y-6">
      {/* Target Market */}
      <div className="space-y-2">
        <Label htmlFor="targetMarket">Target Market & Customers</Label>
        <Textarea
          id="targetMarket"
          placeholder="Describe your ideal customers, their demographics, needs, and pain points..."
          value={formData.targetMarket}
          onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Unique Value Proposition */}
      <div className="space-y-2">
        <Label htmlFor="uniqueValue">Unique Value Proposition</Label>
        <Textarea
          id="uniqueValue"
          placeholder="What makes your idea unique? How does it solve problems differently than existing solutions?"
          value={formData.uniqueValue}
          onChange={(e) => setFormData({ ...formData, uniqueValue: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Business Model */}
      <div className="space-y-2">
        <Label htmlFor="businessModel">Revenue Model</Label>
        <Select
          value={formData.businessModel}
          onValueChange={(value) => setFormData({ ...formData, businessModel: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="How will you make money?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="subscription">Subscription/SaaS</SelectItem>
            <SelectItem value="one-time">One-time Purchase</SelectItem>
            <SelectItem value="freemium">Freemium</SelectItem>
            <SelectItem value="marketplace">Marketplace Commission</SelectItem>
            <SelectItem value="advertising">Advertising</SelectItem>
            <SelectItem value="licensing">Licensing</SelectItem>
            <SelectItem value="consulting">Consulting/Services</SelectItem>
            <SelectItem value="hybrid">Hybrid Model</SelectItem>
            <SelectItem value="unsure">Not sure yet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Additional Context */}
      <div className="space-y-2">
        <Label htmlFor="additionalContext">Additional Context (Optional)</Label>
        <Textarea
          id="additionalContext"
          placeholder="Any additional information, inspiration, or specific requirements for your business idea..."
          value={formData.additionalContext || ""}
          onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
          className="min-h-[80px]"
        />
      </div>
    </div>
  )
}
