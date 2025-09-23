import { Navigation } from "@/components/ui/navigation"
import { Footer } from "@/components/ui/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, BarChart3, Users, Zap, Shield, Globe, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning algorithms analyze market trends, competition, and opportunities to provide data-driven insights for your business ideas.",
  },
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description:
      "Real-time market data, competitor analysis, and trend forecasting to help you make informed decisions about your business strategy.",
  },
  {
    icon: Users,
    title: "Community Network",
    description:
      "Connect with fellow entrepreneurs, mentors, and investors in our global community of business builders and innovators.",
  },
  {
    icon: Zap,
    title: "Rapid Prototyping",
    description: "Generate business models, financial projections, and go-to-market strategies in minutes, not months.",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description:
      "Comprehensive risk analysis and mitigation strategies to help you navigate potential challenges before they become problems.",
  },
  {
    icon: Globe,
    title: "Global Insights",
    description:
      "Access market intelligence from emerging economies and developed markets worldwide to identify the best opportunities.",
  },
]

const capabilities = [
  "Multi-modal idea input (text, voice, images)",
  "AI-powered market validation",
  "Automated business model generation",
  "Financial forecasting and projections",
  "Competitor analysis and positioning",
  "Go-to-market strategy development",
  "Risk assessment and mitigation",
  "Performance tracking and analytics",
]

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 hero-gradient">
          <div className="max-w-7xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/15 text-primary border-primary/30 font-medium">Platform Overview</Badge>
            <h1 className="text-4xl sm:text-6xl font-bold text-balance mb-6">
              The Complete <span className="gradient-text">AI Business</span> Platform
            </h1>
            <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-8">
              From idea validation to scaling, BizPilot provides everything you need to build successful businesses with
              the power of artificial intelligence.
            </p>
            <Link href="/signup">
              <Button size="lg" className="btn-primary-enhanced font-medium">
                Start Building Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to transform ideas into successful businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Capabilities */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">Built for Modern Entrepreneurs</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  BizPilot combines cutting-edge AI technology with proven business methodologies to give you an unfair
                  advantage in today's competitive market.
                </p>
                <div className="space-y-3">
                  {capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="BizPilot Dashboard"
                  className="rounded-lg shadow-2xl border border-border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">Ready to Build Your Next Business?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of entrepreneurs who are already using BizPilot to validate, build, and scale their
              businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="btn-primary-enhanced font-medium">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="btn-outline-hover font-medium bg-transparent">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
