import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="text-center mb-8">
            <Logo className="justify-center mb-6" />
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your BizPilot account</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 to-accent/10 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-primary">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Transform Ideas into Reality</h3>
          <p className="text-muted-foreground">
            Join thousands of entrepreneurs who use BizPilot to validate, strategize, and scale their businesses with
            AI-powered insights.
          </p>
        </div>
      </div>
    </div>
  )
}
