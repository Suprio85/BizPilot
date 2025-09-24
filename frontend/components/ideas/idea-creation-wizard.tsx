"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { saveIdea, transformApiResponseToStoredIdea } from "@/lib/ideas-store"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { IdeaBasicsStep } from "./steps/idea-basics-step"
import { IdeaDetailsStep } from "./steps/idea-details-step"
import { MarketAnalysisStep } from "./steps/market-analysis-step"
import { ReviewStep } from "./steps/review-step"

const steps = [
  {
    title: "Basic Information",
    description: "Tell us about your business idea",
    component: IdeaBasicsStep,
  },
  {
    title: "Detailed Description",
    description: "Provide more context and specifics",
    component: IdeaDetailsStep,
  },
  {
    title: "Market & Competition",
    description: "Define your target market and competition",
    component: MarketAnalysisStep,
  },
  {
    title: "Review & Generate",
    description: "Review your idea and generate business models",
    component: ReviewStep,
  },
]

export function IdeaCreationWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budget: "",
    timeline: "",
    targetMarket: "",
    competitors: "",
    uniqueValue: "",
    businessModel: "",
    voiceInput: "",
    uploadedFiles: [],
  })
  const router = useRouter()

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Generate business models - submit to backend
      setIsSubmitting(true)
      try {
        // Map frontend form fields to backend expected schema (BusinessIdeaRequest)
        const requestBody = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location || "",
          budgetRange: formData.budget || "",
            // timelineRange expects a single string e.g. "6-12months"
          timelineRange: formData.timeline || "",
          target_market_customers: formData.targetMarket || undefined,
          key_competitors: formData.competitors || undefined,
          unique_value_proposition: formData.uniqueValue || undefined,
          revenue_model: formData.businessModel || undefined,
          additional_context: formData.voiceInput || undefined,
        }

        console.log('Sending idea to backend:', requestBody)

        const response = await fetch('http://localhost:8000/ideas/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || 'demo-token'}`,
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
        }

  const apiResult = await response.json()
  console.log('Idea analyzed successfully:', apiResult)
  const stored = transformApiResponseToStoredIdea(apiResult, { title: formData.title, description: formData.description, category: formData.category })
  saveIdea(stored)
  router.push(`/dashboard/ideas/${stored.id}`)
      } catch (error) {
        console.error('Error creating idea:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100
  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CurrentStepComponent formData={formData} setFormData={setFormData} />

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-border">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0 || isSubmitting}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={nextStep} className="glow-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : (currentStep === steps.length - 1 ? "Generate Models" : "Continue")}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              {isSubmitting && <Sparkles className="w-4 h-4 ml-2 animate-spin" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
