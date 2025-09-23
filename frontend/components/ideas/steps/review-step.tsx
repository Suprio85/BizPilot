"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Lightbulb, Target, TrendingUp } from "lucide-react"

interface ReviewStepProps {
  formData: any
  setFormData: (data: any) => void
}

export function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Review Your Business Idea</h3>
        <p className="text-muted-foreground">
          Please review the information below. Once you generate models, our AI will create comprehensive business
          strategies based on this data.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-foreground">{formData.title || "Untitled Idea"}</h4>
              <p className="text-sm text-muted-foreground mt-1">{formData.description || "No description provided"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.category && <Badge variant="secondary">{formData.category}</Badge>}
              {formData.location && <Badge variant="outline">{formData.location}</Badge>}
              {formData.budget && <Badge variant="outline">Budget: {formData.budget}</Badge>}
              {formData.timeline && <Badge variant="outline">Timeline: {formData.timeline}</Badge>}
            </div>
            {(formData.voiceInput || (formData.uploadedFiles && formData.uploadedFiles.length)) && (
              <div className="pt-2 space-y-2">
                {formData.voiceInput && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground">Voice Notes</h5>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{formData.voiceInput}</p>
                  </div>
                )}
                {Array.isArray(formData.uploadedFiles) && formData.uploadedFiles.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground">Uploaded Files</h5>
                    <div className="flex flex-wrap gap-2">
                      {formData.uploadedFiles.map((f: any, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {f.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Market & Strategy */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Market & Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.targetMarket && (
              <div>
                <h4 className="font-medium text-sm text-foreground mb-1">Target Market</h4>
                <p className="text-sm text-muted-foreground">{formData.targetMarket}</p>
              </div>
            )}
            {formData.uniqueValue && (
              <div>
                <h4 className="font-medium text-sm text-foreground mb-1">Unique Value Proposition</h4>
                <p className="text-sm text-muted-foreground">{formData.uniqueValue}</p>
              </div>
            )}
            {formData.businessModel && (
              <div>
                <h4 className="font-medium text-sm text-foreground mb-1">Revenue Model</h4>
                <Badge variant="secondary">{formData.businessModel}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Competition Analysis */}
        {(formData.competitors || formData.competitiveAdvantage) && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Competition Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.competitors && formData.competitors.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-foreground mb-2">Key Competitors</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.competitors
                      .filter((comp: string) => comp.trim())
                      .map((competitor: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {competitor}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
              {formData.competitiveAdvantage && (
                <div>
                  <h4 className="font-medium text-sm text-foreground mb-1">Competitive Advantage</h4>
                  <p className="text-sm text-muted-foreground">{formData.competitiveAdvantage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* What happens next */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              What happens next?
            </CardTitle>
            <CardDescription>Our AI will analyze your idea and generate comprehensive business models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Market analysis and validation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Financial projections and forecasts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Go-to-market strategy recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Risk assessment and mitigation plans</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Interactive business model canvas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
