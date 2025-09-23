import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    content:
      "BizPilot helped me validate my eco-friendly packaging idea and provided a complete roadmap. Within 3 months, I had a working prototype and first customers.",
    author: "Sarah Chen",
    role: "Founder, EcoWrap",
    location: "Singapore",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: "20 days saved on daily builds",
  },
  {
    content:
      "The AI-powered market analysis was incredibly accurate. BizPilot identified opportunities I never considered and helped me pivot to a more profitable model.",
    author: "Ahmed Rahman",
    role: "CEO, TechSolutions BD",
    location: "Dhaka, Bangladesh",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: "98% faster time to market",
  },
  {
    content:
      "As an incubator, we use BizPilot to evaluate hundreds of startup ideas. The batch processing and analytics dashboard are game-changers for our workflow.",
    author: "Maria Rodriguez",
    role: "Director, StartupHub",
    location: "Mexico City",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: "300% increase in evaluation efficiency",
  },
  {
    content:
      "The voice input feature is perfect for busy entrepreneurs. I can brainstorm ideas during commutes and get instant feedback on feasibility and market potential.",
    author: "David Kim",
    role: "Serial Entrepreneur",
    location: "Seoul, South Korea",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: "6x faster to build + deploy",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Faster iteration. <span className="gradient-text">More innovation.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The platform for rapid business progress. Let entrepreneurs focus on building great products instead of
            managing complex business planning infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-2xl font-bold text-primary mb-2">{testimonial.stats}</div>
                  <p className="text-muted-foreground leading-relaxed">"{testimonial.content}"</p>
                </div>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                    <AvatarFallback>
                      {testimonial.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
