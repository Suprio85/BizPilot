"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Generate business models and redirect
      router.push("/dashboard/ideas/1")
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
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={nextStep} className="glow-primary">
              {currentStep === steps.length - 1 ? "Generate Models" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
