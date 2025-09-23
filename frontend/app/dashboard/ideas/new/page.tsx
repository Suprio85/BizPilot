import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { IdeaCreationWizard } from "@/components/ideas/idea-creation-wizard"

export default function NewIdeaPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Business Idea</h1>
          <p className="text-muted-foreground mt-2">
            Transform your concept into a comprehensive business model with AI-powered insights and analysis.
          </p>
        </div>
        <IdeaCreationWizard />
      </div>
    </DashboardLayout>
  )
}
