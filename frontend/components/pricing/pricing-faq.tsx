"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How does the free plan work?",
    answer:
      "The free plan gives you access to core BizPilot features including 2 business models per idea, 3-month forecasts, and basic AI chat with 50 messages per month. It's perfect for exploring the platform and validating your first business ideas.",
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll be charged the prorated amount for the remainder of your billing cycle. When you downgrade, the change will take effect at the end of your current billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through Stripe.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer:
      "Yes! Pro plan comes with a 14-day free trial. You can cancel anytime during the trial period without being charged. Enterprise plans include a 30-day trial with dedicated onboarding support.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your data remains accessible for 30 days after cancellation. You can export all your business ideas, models, and analytics during this period. After 30 days, data is permanently deleted for security reasons.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with BizPilot, contact our support team within 30 days of your purchase for a full refund.",
  },
  {
    question: "Can I use BizPilot for multiple businesses?",
    answer:
      "There's no limit to the number of business ideas you can create and analyze. Pro and Enterprise plans offer unlimited business models and advanced features for managing multiple ventures.",
  },
  {
    question: "Is my business data secure?",
    answer:
      "Yes, we take security seriously. All data is encrypted in transit and at rest, we maintain SOC 2 compliance, and Enterprise plans include additional security features like SSO and audit logs.",
  },
]

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about BizPilot pricing and features.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-0">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@bizpilot.ai" className="text-primary hover:underline">
              Email Support
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a href="/contact" className="text-primary hover:underline">
              Contact Sales
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a href="/docs" className="text-primary hover:underline">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
