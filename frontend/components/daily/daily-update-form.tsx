"use client"
import { attachAiSummary, createDailyUpdate, DailyUpdateInput, loadDailyUpdates } from '@/lib/daily-updates-store'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface Props { onCompleted?: (id: string) => void }

export function DailyUpdateForm({ onCompleted }: Props) {
  const today = new Date().toISOString().slice(0,10)
  const [form, setForm] = useState<DailyUpdateInput>({
    date: today,
    sales_demand: { units_sold: null, new_orders: null, product_attention: '' },
    customer_engagement: { inquiries_feedback: '', visits: null, new_followers: null },
    marketing_outreach: { posted: 'No', channel: '', budget: null },
    operations_supply: { issues: '', produced_restock: null },
    challenges_insights: { biggest_challenge: '', new_opportunity: '' }
  })
  const [submitting, setSubmitting] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const updateField = (section: keyof DailyUpdateInput, key: string, value: any) => {
    setForm(prev => ({ ...prev, [section]: { ...(prev as any)[section], [key]: value } }))
  }

  const handleSubmit = async () => {
    setSubmitting(true); setError(null)
    try {
      // Create local record first (for local history) but keep ID
      const record = createDailyUpdate(form)
      // Prepare historical excluding today (sorted oldest -> newest)
      const all = loadDailyUpdates()
        .filter(u => u.id !== record.id)
        .sort((a,b) => a.date.localeCompare(b.date))
        .map(u => ({
          date: u.date,
          sales_demand: u.sales_demand,
          customer_engagement: u.customer_engagement,
            marketing_outreach: u.marketing_outreach,
            operations_supply: u.operations_supply,
            challenges_insights: u.challenges_insights
        }))

      const payload = {
        update: {
          date: record.date,
          sales_demand: record.sales_demand,
          customer_engagement: record.customer_engagement,
          marketing_outreach: record.marketing_outreach,
          operations_supply: record.operations_supply,
          challenges_insights: record.challenges_insights
        },
        historical: all,
        predicted_demand: {} // placeholder optional field
      }

      const resp = await fetch('http://localhost:8000/daily/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!resp.ok) throw new Error('AI service error ' + resp.status)
      const data = await resp.json()
      attachAiSummary(record.id, data.summary)
      setAiResult(data)
      onCompleted?.(record.id)
    } catch (e:any) {
      setError(e.message)
    } finally { setSubmitting(false) }
  }

  return (
    <Card className="border-border">
      <CardHeader><CardTitle>Daily Business Update</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Sales & Demand</h3>
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" placeholder="Units Sold" value={form.sales_demand.units_sold ?? ''} onChange={e => updateField('sales_demand','units_sold', e.target.value ? Number(e.target.value) : null)} />
              <Input type="number" placeholder="New Orders" value={form.sales_demand.new_orders ?? ''} onChange={e => updateField('sales_demand','new_orders', e.target.value ? Number(e.target.value) : null)} />
              <Input placeholder="Attention Focus" value={form.sales_demand.product_attention} onChange={e => updateField('sales_demand','product_attention', e.target.value)} />
            </div>
            <h3 className="font-medium">Customer Engagement</h3>
            <Textarea placeholder="Inquiries & Feedback" value={form.customer_engagement.inquiries_feedback} onChange={e => updateField('customer_engagement','inquiries_feedback', e.target.value)} />
            <div className="grid grid-cols-3 gap-2">
              <Input type="number" placeholder="Visits" value={form.customer_engagement.visits ?? ''} onChange={e => updateField('customer_engagement','visits', e.target.value ? Number(e.target.value) : null)} />
              <Input type="number" placeholder="New Followers" value={form.customer_engagement.new_followers ?? ''} onChange={e => updateField('customer_engagement','new_followers', e.target.value ? Number(e.target.value) : null)} />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Marketing Outreach</h3>
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="Posted? Yes/No" value={form.marketing_outreach.posted} onChange={e => updateField('marketing_outreach','posted', e.target.value)} />
              <Input placeholder="Channel" value={form.marketing_outreach.channel} onChange={e => updateField('marketing_outreach','channel', e.target.value)} />
              <Input type="number" placeholder="Budget" value={form.marketing_outreach.budget ?? ''} onChange={e => updateField('marketing_outreach','budget', e.target.value ? Number(e.target.value) : null)} />
            </div>
            <h3 className="font-medium">Operations & Supply</h3>
            <Textarea placeholder="Issues" value={form.operations_supply.issues} onChange={e => updateField('operations_supply','issues', e.target.value)} />
            <Input type="number" placeholder="Produced / Restock" value={form.operations_supply.produced_restock ?? ''} onChange={e => updateField('operations_supply','produced_restock', e.target.value ? Number(e.target.value) : null)} />
            <h3 className="font-medium">Challenges & Insights</h3>
            <Textarea placeholder="Biggest Challenge" value={form.challenges_insights.biggest_challenge} onChange={e => updateField('challenges_insights','biggest_challenge', e.target.value)} />
            <Textarea placeholder="New Opportunity" value={form.challenges_insights.new_opportunity} onChange={e => updateField('challenges_insights','new_opportunity', e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button disabled={submitting} onClick={handleSubmit} className="glow-primary">{submitting ? 'Analyzing...' : 'Submit & Analyze'}</Button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {aiResult && (
          <div className="mt-4 p-4 border rounded-lg bg-muted space-y-3 text-sm">
            <p className="font-medium">Momentum Score: <span className="font-mono">{aiResult.momentum_score}</span></p>
            <p className="text-sm"><strong>Summary:</strong> {aiResult.summary}</p>
            <div>
              <h4 className="font-medium">Risks</h4>
              <ul className="list-disc ml-5 space-y-1">{aiResult.risks?.map((r:string,i:number)=><li key={i}>{r}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-medium">Opportunities</h4>
              <ul className="list-disc ml-5 space-y-1">{aiResult.opportunities?.map((r:string,i:number)=><li key={i}>{r}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-medium">Recommended Actions</h4>
              <ul className="list-disc ml-5 space-y-1">{aiResult.actions?.map((r:string,i:number)=><li key={i}>{r}</li>)}</ul>
            </div>
            <div>
              <h4 className="font-medium">Checklist for Tomorrow</h4>
              <ul className="list-disc ml-5 space-y-1">{aiResult.checklist?.map((r:string,i:number)=><li key={i}>{r}</li>)}</ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
