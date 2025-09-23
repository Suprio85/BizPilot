import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Sparkles, Zap, Target } from "lucide-react"

const models = [
  {
    name: "BizPilot Starter",
    description: "Perfect model for new entrepreneurs and idea validation",
    icon: Sparkles,
    features: ["Basic idea analysis", "Market research", "Simple business model", "3-month forecasts", "Email support"],
    badge: "Most Popular",
  },
  {
    name: "BizPilot Pro",
    description: "Advanced model balancing comprehensive analysis and speed",
    icon: Zap,
    features: [
      "Advanced idea analysis",
      "Competitive intelligence",
      "Multi-variant models",
      "12-month forecasts",
      "Priority support",
    ],
    badge: "Recommended",
  },
  {
    name: "BizPilot Enterprise",
    description: "Most powerful model for complex business strategies",
    icon: Target,
    features: [
      "Enterprise-grade analysis",
      "Custom AI fine-tuning",
      "Unlimited variants",
      "24-month forecasts",
      "Dedicated support",
    ],
    badge: "Enterprise",
  },
]

export function ModelsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">AI Business Models</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful AI models for a variety of business scenarios with comprehensive analysis and strategic insights
            tailored to your industry and market.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {models.map((model, index) => (
            <Card
              key={index}
              className="relative border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              {model.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {model.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <model.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{model.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{model.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {model.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-6" variant={index === 1 ? "default" : "outline"}>
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
