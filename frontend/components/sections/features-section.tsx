import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, TrendingUp, Users, BarChart3, Globe, Shield, Lightbulb, Target, Rocket } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Ultra-fast ideation-to-execution",
    description:
      "Generate 2–3 comprehensive, simulation-tested startup models in under a minute with interactive visualizations.",
  },
  {
    icon: TrendingUp,
    title: "Scalable monetization",
    description:
      "Freemium model with premium tiers unlocking advanced simulations, API integrations, and custom AI fine-tuning.",
  },
  {
    icon: Users,
    title: "Community-driven evolution",
    description:
      "User feedback loops to refine AI models, plus a marketplace for sharing business templates and collaborations.",
  },
  {
    icon: BarChart3,
    title: "Advanced analytics",
    description:
      "Monte Carlo risk assessments, predictive forecasting, and real-time market simulations for informed decisions.",
  },
  {
    icon: Globe,
    title: "Global market insights",
    description: "Localized business intelligence for emerging markets with cultural and economic context integration.",
  },
  {
    icon: Shield,
    title: "Enterprise security",
    description:
      "Robust data encryption, audit trails, and compliance features for business-critical information protection.",
  },
  {
    icon: Lightbulb,
    title: "Multi-modal input",
    description:
      "Voice dictation, image uploads, PDF analysis, and text input for comprehensive idea capture and analysis.",
  },
  {
    icon: Target,
    title: "Precision targeting",
    description: "AI-powered market segmentation and customer persona development for focused go-to-market strategies.",
  },
  {
    icon: Rocket,
    title: "Automated workflows",
    description: "Streamlined operational processes from supply chain optimization to customer acquisition automation.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The complete platform to <span className="gradient-text">build the business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your team's toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best
            business experiences with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
