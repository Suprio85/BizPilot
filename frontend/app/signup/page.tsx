import { SignupForm } from "@/components/auth/signup-form"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 to-accent/10 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-primary">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Start Your Business Journey</h3>
          <p className="text-muted-foreground">
            Get started with BizPilot today and transform your business ideas into successful ventures with AI-powered
            guidance and automation.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center mb-8">
            <Logo className="justify-center mb-6" />
            <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground mt-2">Start building your business with AI</p>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
