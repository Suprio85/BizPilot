import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { IdeaDetailView } from "@/components/ideas/idea-detail-view"

export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  return (
      <IdeaDetailView ideaId={params.id} />
  )
}
