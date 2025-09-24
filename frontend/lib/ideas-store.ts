// Lightweight client-side persistence for analyzed ideas until backend storage exists.
// Stored under key 'bizpilot_ideas' in localStorage.

export interface StoredBusinessModel {
  id: string
  name: string
  description: string
  revenueDisplay: string
  profitMargin: string
  timeToBreakeven: string
  riskLevel: string
  revenueK: number
  marginPct: number
  churnPct?: number
}

export interface StoredIdea {
  id: string
  title: string
  description?: string
  category?: string
  status: 'completed'
  successScore: number
  createdAt: string
  lastUpdated: string
  marketAnalysis: {
    marketSizeUSD: number
    growthRatePct: number
    targetCustomers: string
    competitorCount: number
    marketOpportunity: string
  }
  businessModels: StoredBusinessModel[]
  risks: Array<{ title: string; type: string; severity: string; description: string }>
  opportunities: Array<{ title: string; type: string; impact: string; description: string }>
  raw: any
}

const STORAGE_KEY = 'bizpilot_ideas'

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) as T } catch { return fallback }
}

export function loadIdeas(): StoredIdea[] {
  if (typeof window === 'undefined') return []
  return safeParse<StoredIdea[]>(localStorage.getItem(STORAGE_KEY), [])
}

export function saveIdea(idea: StoredIdea) {
  if (typeof window === 'undefined') return
  const ideas = loadIdeas()
  const idx = ideas.findIndex(i => i.id === idea.id)
  if (idx >= 0) {
    ideas[idx] = idea
  } else {
    ideas.push(idea)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas))
}

export function getIdea(id: string): StoredIdea | undefined {
  return loadIdeas().find(i => i.id === id)
}

export function transformApiResponseToStoredIdea(api: any, extras: { title: string; description?: string; category?: string }): StoredIdea {
  const now = new Date().toISOString()
  const market = api.marketAnalysis || {}
  const bizModels = (api.businessModelsSummary || []).map((m: any, idx: number) => {
    const margin = m.profitMarginPct ?? 0
    let riskLevel = 'Medium'
    if (margin >= 30) riskLevel = 'Low'
    else if (margin < 15) riskLevel = 'High'
    return {
      id: String(idx + 1),
      name: m.name,
      description: `${m.name} model`,
      revenueDisplay: `${m.projectedRevenueK}K/mo projected`,
      profitMargin: `${m.profitMarginPct}%`,
      timeToBreakeven: `${m.breakEvenMonths} months`,
      riskLevel,
      revenueK: m.projectedRevenueK,
      marginPct: m.profitMarginPct,
      churnPct: 0,
    }
  })
  return {
    id: crypto.randomUUID(),
    title: extras.title,
    description: extras.description,
    category: extras.category,
    status: 'completed',
    successScore: api.successScore ?? 0,
    createdAt: now,
    lastUpdated: now,
    marketAnalysis: {
      marketSizeUSD: market.marketSizeUSD ?? 0,
      growthRatePct: market.growthRatePct ?? 0,
      targetCustomers: market.targetCustomers || '',
      competitorCount: market.competitorCount ?? 0,
      marketOpportunity: market.marketOpportunity || 'Medium'
    },
    businessModels: bizModels,
    risks: api.risks || [],
    opportunities: api.opportunities || [],
    raw: api
  }
}

export function formatMarketSize(value: number): string {
  if (value >= 1_000_000_000) return `$${(value/1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `$${(value/1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value/1_000).toFixed(1)}K`
  return `$${value}`
}