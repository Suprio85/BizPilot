"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/ui/logo"

const steps = [
  {
    title: "Welcome to BizPilot",
    description: "Let's get you set up for success",
    content: "WelcomeStep",
  },
  {
    title: "Tell us about yourself",
    description: "Help us personalize your experience",
    content: "ProfileStep",
  },
  {
    title: "Choose your plan",
    description: "Select the plan that fits your needs",
    content: "PlanStep",
  },
  {
    title: "You're all set!",
    description: "Ready to start building your business",
    content: "CompleteStep",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <Progress value={progress} className="mb-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          <Card className="border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 0 && <WelcomeStep />}
              {currentStep === 1 && <ProfileStep />}
              {currentStep === 2 && <PlanStep />}
              {currentStep === 3 && <CompleteStep />}

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={nextStep} className="glow-primary">
                  {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-4">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto glow-primary">
        <CheckCircle className="w-10 h-10 text-primary" />
      </div>
      <p className="text-muted-foreground">
        BizPilot will help you transform your business ideas into reality with AI-powered insights, strategic planning,
        and automated workflows.
      </p>
    </div>
  )
}

function ProfileStep() {
  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-6">
        This information helps us provide more relevant recommendations and insights.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="font-medium">First-time Entrepreneur</h3>
            <p className="text-sm text-muted-foreground">New to business</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-medium">Experienced Founder</h3>
            <p className="text-sm text-muted-foreground">Have started businesses before</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PlanStep() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card className="border-2 border-primary/50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Recommended
            </span>
          </div>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">Free Plan</h3>
              <p className="text-3xl font-bold text-primary">
                $0<span className="text-sm text-muted-foreground">/month</span>
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />2 business models per idea
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                3-month forecasts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Basic AI chat (50 messages/month)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CompleteStep() {
  return (
    <div className="text-center space-y-4">
      <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <p className="text-muted-foreground">
        Your account is ready! You can now start creating business ideas, generating models, and building your venture
        with AI assistance.
      </p>
    </div>
  )
}
