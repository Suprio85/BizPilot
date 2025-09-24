// Lightweight client-side persistence for daily business updates until backend storage.
// Key structure: array of DailyUpdate objects with AI analysis appended.

export interface DailyUpdateInput {
  date: string // ISO date
  sales_demand: {
    units_sold: number | null
    new_orders: number | null
    product_attention: string
  }
  customer_engagement: {
    inquiries_feedback: string
    visits: number | null
    new_followers: number | null
  }
  marketing_outreach: {
    posted: string // Yes/No
    channel: string
    budget: number | null
  }
  operations_supply: {
    issues: string
    produced_restock: number | null
  }
  challenges_insights: {
    biggest_challenge: string
    new_opportunity: string
  }
}

export interface DailyUpdateRecord extends DailyUpdateInput {
  id: string
  createdAt: string
  aiSummary?: string
}

const STORAGE_KEY = 'bizpilot_daily_updates'

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) as T } catch { return fallback }
}

export function loadDailyUpdates(): DailyUpdateRecord[] {
  if (typeof window === 'undefined') return []
  return safeParse<DailyUpdateRecord[]>(localStorage.getItem(STORAGE_KEY), [])
}

export function saveDailyUpdate(rec: DailyUpdateRecord) {
  if (typeof window === 'undefined') return
  const all = loadDailyUpdates()
  const idx = all.findIndex(r => r.id === rec.id)
  if (idx >= 0) all[idx] = rec; else all.unshift(rec)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function createDailyUpdate(input: DailyUpdateInput): DailyUpdateRecord {
  const now = new Date().toISOString()
  const rec: DailyUpdateRecord = { id: crypto.randomUUID(), createdAt: now, ...input }
  saveDailyUpdate(rec)
  return rec
}

export function attachAiSummary(id: string, summary: string) {
  const all = loadDailyUpdates()
  const idx = all.findIndex(r => r.id === id)
  if (idx >= 0) {
    all[idx].aiSummary = summary
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    return all[idx]
  }
  return undefined
}

export function formatPromptForUpdate(rec: DailyUpdateRecord): string {
  return `You are an AI business progress analyst. Given today's operational update provide:\n1. Concise performance summary\n2. Key risks & opportunities (bullet points)\n3. Recommended next actions (max 5)\n4. A 0-100 momentum score (JSON key momentum_score).\nReturn JSON with keys: summary, risks, opportunities, actions, momentum_score.\n\nDATA:\n${JSON.stringify(rec, null, 2)}`
}
