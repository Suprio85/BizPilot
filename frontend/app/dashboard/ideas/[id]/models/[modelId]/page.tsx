import BusinessModelView from "@/components/ideas/business-model-view";

export default function BusinessModelPage({ params }: { params: { id: string; modelId: string } }) {
  return <BusinessModelView ideaId={params.id} modelId={params.modelId} />
}
