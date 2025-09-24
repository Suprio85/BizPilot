import { DailyUpdateForm } from '@/components/daily/daily-update-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { loadDailyUpdates } from '@/lib/daily-updates-store'
import Link from 'next/link'

export default function DailyUpdatesPage() {
  const updates = typeof window === 'undefined' ? [] : loadDailyUpdates()
  return (
    <div className="space-y-8">
      <DailyUpdateForm />
      {updates.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Updates</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {updates.slice(0,6).map(u => (
              <Card key={u.id} className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{u.date}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <p><strong>Units Sold:</strong> {u.sales_demand.units_sold ?? '-'} | <strong>New Orders:</strong> {u.sales_demand.new_orders ?? '-'}</p>
                  {u.aiSummary && <p className="line-clamp-3 text-muted-foreground">{u.aiSummary}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">(Local storage only for now)</p>
        </div>
      )}
      <Link href="/dashboard/ideas" className="text-xs underline text-muted-foreground">Back to Ideas</Link>
    </div>
  )
}
