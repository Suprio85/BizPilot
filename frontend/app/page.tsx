import { Navigation } from "@/components/ui/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { ModelsSection } from "@/components/sections/models-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { CTASection } from "@/components/sections/cta-section"
import { Footer } from "@/components/ui/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ModelsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
