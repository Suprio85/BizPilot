"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Mic, Upload, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [ideaInput, setIdeaInput] = useState("")

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Business Assistant
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6">
            The fastest and most powerful <span className="gradient-text">platform for building</span> AI businesses
          </h1>

          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-12">
            Transform raw ideas into thriving businesses with intelligent automation from ideation and multi-faceted
            go-to-market strategies, to advanced supply-chain optimization and predictive forecasting.
          </p>

          {/* Interactive Demo Widget */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Try BizPilot AI Demo</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Describe your business idea... (e.g., eco-friendly shoe brand in Dhaka)"
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button className="btn-primary-enhanced">
                  Generate Models
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Get 2-3 comprehensive, simulation-tested startup models in under a minute
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="btn-primary-enhanced">
                Start Building
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="mt-20">
          <p className="text-center text-sm text-muted-foreground mb-8">TRUSTED BY ENTREPRENEURS AT</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">StartupBD</div>
            <div className="text-lg font-semibold">TechHub</div>
            <div className="text-lg font-semibold">InnovateX</div>
            <div className="text-lg font-semibold">VentureSpace</div>
            <div className="text-lg font-semibold">BusinessLab</div>
          </div>
        </div>
      </div>
    </section>
  )
}
