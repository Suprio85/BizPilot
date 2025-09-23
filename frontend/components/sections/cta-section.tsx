import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-border">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-sm text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            Ready to Transform Your Ideas?
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Make business planning <span className="gradient-text">seamless</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tools for entrepreneurs and innovators to validate ideas, create strategies, and scale businesses faster
            with AI-powered insights and automation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="glow-primary">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Free tier available • No credit card required • Start in minutes
          </p>
        </div>
      </div>
    </section>
  )
}
