import { Navigation } from "@/components/ui/navigation"
import { PricingSection } from "@/components/pricing/pricing-section"
import { PricingFAQ } from "@/components/pricing/pricing-faq"
import { Footer } from "@/components/ui/footer"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <PricingSection />
        <PricingFAQ />
      </main>
      <Footer />
    </div>
  )
}
