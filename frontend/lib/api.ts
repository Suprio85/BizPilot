// Centralized API helper so we only change base URL in one place
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'

export interface ApiOptions extends RequestInit {
  token?: string | null
  json?: any
}

export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, json, headers, ...rest } = options
  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(headers || {})
  }
  if (token) {
    (finalHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : rest.body
  })
  if (!res.ok) {
    let detail: any
    try { detail = await res.json() } catch { /* ignore */ }
    const message = detail?.detail || detail?.error || `Request failed (${res.status})`
    throw new Error(message)
  }
  // Some endpoints may return empty body
  const text = await res.text()
  return text ? JSON.parse(text) : ({} as T)
}

export function buildIdeaPayload(raw: any) {
  const payload: Record<string, any> = {}
  const mappings: Record<string, string> = {
    title: 'title',
    description: 'description',
    category: 'category',
    location: 'location',
    budget: 'budgetRange',
    timeline: 'timelineRange',
    targetMarket: 'target_market_customers',
    competitors: 'key_competitors',
    uniqueValue: 'unique_value_proposition',
    businessModel: 'revenue_model',
    voiceInput: 'additional_context'
  }
  Object.entries(mappings).forEach(([from, to]) => {
    const value = raw[from]
    if (value && String(value).trim().length > 0) {
      payload[to] = value
    }
  })
  return payload
}