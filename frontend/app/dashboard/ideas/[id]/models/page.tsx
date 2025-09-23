import { IdeaModelsView } from "@/components/ideas/idea-models-view"

export default function IdeaModelsPage({ params }: { params: { id: string } }) {
  return <IdeaModelsView ideaId={params.id} />
}
