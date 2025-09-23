import { Zap } from "lucide-react"

interface LogoProps {
  className?: string
  showText?: boolean
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-primary">
          <Zap className="w-5 h-5 text-white" />
        </div>
      </div>
      {showText && <span className="text-xl font-bold text-foreground">BizPilot</span>}
    </div>
  )
}
