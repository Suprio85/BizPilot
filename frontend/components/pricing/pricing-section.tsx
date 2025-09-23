"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Building } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    description: "Perfect for exploring and validating your first business ideas",
    price: "$0",
    period: "forever",
    icon: Zap,
    features: [
      "2 business models per idea",
      "3-month forecasts",
      "Basic AI chat (50 messages/month)",
      "Core features only",
      "Community support",
      "Basic templates",
    ],
    limitations: ["Limited to 3 active ideas", "No advanced simulations", "No API access", "Standard support only"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "For serious entrepreneurs ready to scale their ventures",
    price: "$9.99",
    period: "per month",
    icon: Crown,
    features: [
      "Unlimited business models with variants",
      "24-month advanced forecasts (ML-enhanced)",
      "Unlimited AI chat with priority processing",
      "Supplier marketplaces integration",
      "Automated templates (emails, contracts)",
      "Advanced integrations (CRM, accounting)",
      "Custom market alerts",
      "Priority support",
      "Advanced analytics dashboard",
      "Export capabilities",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and organizations building multiple ventures",
    price: "$49.99",
    period: "per month",
    icon: Building,
    features: [
      "Everything in Pro",
      "Team accounts (up to 10 users)",
      "White-label branding",
      "API access for custom integrations",
      "Dedicated AI fine-tuning",
      "Custom model training",
      "SLA guarantees (99.9% uptime)",
      "Analytics exports for investors",
      "Dedicated account manager",
      "Custom onboarding",
      "Advanced security features",
      "Bulk idea processing",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your entrepreneurial journey. Start free and upgrade as you grow your business
            empire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative border-border hover:border-primary/50 transition-all duration-300 ${
                plan.popular ? "border-primary/50 shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Limitations:</h4>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-3">
                          <div className="w-4 h-4 flex-shrink-0 mt-0.5">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full mx-auto mt-1.5"></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href={plan.name === "Free" ? "/signup" : "/dashboard/billing"}>
                  <Button
                    className={`w-full mt-6 ${plan.popular ? "glow-primary" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>SSL encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Data backup</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Mobile app access</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Regular updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
