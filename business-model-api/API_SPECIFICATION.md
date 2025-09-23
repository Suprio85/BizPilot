# BizPilot Backend API Specification

## Overview

This document provides the complete backend API specification for BizPilot, a business idea analysis platform. The API supports user authentication, idea management, business model generation, market analysis, AI chat, file uploads, and billing.

## Conventions

- **Authentication**: Bearer JWT token in `Authorization` header
- **IDs**: UUID v4 strings
- **Timestamps**: ISO-8601 format (UTC)
- **Pagination**: `page`, `pageSize`, `total` parameters
- **Errors**: Consistent error format with status codes
- **Base URL**: `/api/v1` (recommended)

## Common Types

```typescript
type UUID = string;                    // e.g., "c0f0c1a9-1234-5678-beef-deadcafebabe"
type ISODate = string;                 // e.g., "2025-09-24T12:34:56Z"

type Plan = "free" | "pro" | "enterprise";
type IdeaStatus = "draft" | "analyzing" | "completed";
type RiskLevel = "Low" | "Medium" | "High";
type OpportunityImpact = "Low" | "Medium" | "High";
type MessageRole = "system" | "user" | "assistant";

type BudgetRange = 
  | "0-1000" | "1000-5000" | "5000-10000" 
  | "10000-25000" | "25000-50000" | "50000+";

type TimelineRange = 
  | "1-3months" | "3-6months" | "6-12months" 
  | "1-2years" | "2years+";

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

interface ErrorResponse {
  error: {
    code: string;         // e.g., "validation_error", "not_found"
    message: string;      // human-readable message
    details?: unknown;    // field errors, validation details
  };
}
```

---

## Authentication & Users

### POST /auth/signup
Create a new user account.

**Request:**
```typescript
interface SignupRequest {
  email: string;
  password: string;      // min 8 characters
  name?: string;
}
```

**Response (201):**
```typescript
interface AuthResponse {
  token: string;         // JWT token
  user: User;
}
```

### POST /auth/login
Authenticate user with email/password.

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response (200):**
```typescript
interface AuthResponse {
  token: string;
  user: User;
}
```

### POST /auth/logout
Invalidate current session token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
{ message: "Logged out successfully" }
```

### GET /auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface User {
  id: UUID;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: Plan;
  usage: UsageSnapshot;
  createdAt: ISODate;
  updatedAt: ISODate;
}

interface UsageSnapshot {
  ideasActive: number;
  ideasLimit: number;
  modelsGeneratedMonth: number;
  modelsLimitMonth: number;
  aiMessagesMonth: number;
  aiMessagesLimitMonth: number;
}
```

---

## Ideas Management

### GET /ideas
List and filter user's ideas.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `search?: string` - Search in title/description
- `status?: IdeaStatus` - Filter by status
- `category?: string` - Filter by category
- `page?: number` - Page number (default: 1)
- `pageSize?: number` - Items per page (default: 20)

**Response (200):**
```typescript
interface IdeaListItem {
  id: UUID;
  title: string;
  description: string;
  category: string;
  status: IdeaStatus;
  progress: number;           // 0-100
  modelsCount: number;
  lastUpdated: ISODate;
  successScore: number;       // 0-100
}

interface IdeasListResponse {
  data: IdeaListItem[];
  pagination: Pagination;
}
```

### POST /ideas
Create a new business idea.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface IdeaCreateRequest {
  title: string;
  description: string;
  category: string;
  location?: string;
  budgetRange?: BudgetRange;
  timelineRange?: TimelineRange;
  targetMarket?: string;
  competitors?: string;
  uniqueValue?: string;
  businessModelPref?: string;
  voiceNotes?: string;
  attachments?: AttachmentInput[];
}

interface AttachmentInput {
  name: string;
  size: number;
  type: string;             // MIME type
  storageKey: string;       // from presigned upload
}
```

**Response (201):**
```typescript
interface IdeaCreateResponse {
  id: UUID;
  message: "Idea created successfully";
}
```

### GET /ideas/:id
Get detailed idea information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface IdeaDetail {
  id: UUID;
  userId: UUID;
  title: string;
  description: string;
  category: string;
  location?: string;
  budgetRange?: BudgetRange;
  timelineRange?: TimelineRange;
  targetMarket?: string;
  competitors?: string;
  uniqueValue?: string;
  businessModelPref?: string;
  voiceNotes?: string;
  attachments: Attachment[];
  status: IdeaStatus;
  progress: number;          // 0-100
  successScore: number;      // 0-100
  createdAt: ISODate;
  lastUpdated: ISODate;
  
  // Embedded sub-resources (optional)
  marketAnalysis?: MarketAnalysis;
  businessModelsSummary?: BusinessModelSummary[];
  risks?: Risk[];
  opportunities?: Opportunity[];
}

interface Attachment {
  id: UUID;
  name: string;
  size: number;
  type: string;
  storageKey: string;
  url?: string;              // signed download URL
  uploadedAt: ISODate;
}
```

### PATCH /ideas/:id
Update idea information.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface IdeaUpdateRequest {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  budgetRange?: BudgetRange;
  timelineRange?: TimelineRange;
  targetMarket?: string;
  competitors?: string;
  uniqueValue?: string;
  businessModelPref?: string;
  voiceNotes?: string;
  status?: IdeaStatus;
  progress?: number;         // 0-100
  successScore?: number;     // 0-100
}
```

**Response (200):**
```typescript
{ message: "Idea updated successfully" }
```

### DELETE /ideas/:id
Delete/archive an idea.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
{ message: "Idea deleted successfully" }
```

---

## Market Analysis

### GET /ideas/:id/market
Get market analysis for an idea.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface MarketAnalysis {
  ideaId: UUID;
  marketSizeUSD: number;        // e.g., 2400000
  growthRatePct: number;        // e.g., 15
  targetCustomers: string;
  competitorCount: number;
  marketOpportunity: OpportunityImpact;
  notes?: string;
  updatedAt: ISODate;
}
```

### PUT /ideas/:id/market
Update market analysis.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface MarketAnalysisUpdateRequest {
  marketSizeUSD?: number;
  growthRatePct?: number;
  targetCustomers?: string;
  competitorCount?: number;
  marketOpportunity?: OpportunityImpact;
  notes?: string;
}
```

**Response (200):**
```typescript
{ message: "Market analysis updated successfully" }
```

---

## Risks & Opportunities

### GET /ideas/:id/risks
List risks for an idea.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface Risk {
  id: UUID;
  ideaId: UUID;
  type: string;              // e.g., "Market", "Supply Chain"
  description: string;
  severity: RiskLevel;
  createdAt: ISODate;
  updatedAt: ISODate;
}

interface RisksResponse {
  data: Risk[];
}
```

### POST /ideas/:id/risks
Create a new risk.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface RiskCreateRequest {
  type: string;
  description: string;
  severity: RiskLevel;
}
```

**Response (201):**
```typescript
interface RiskCreateResponse {
  id: UUID;
  message: "Risk created successfully";
}
```

### PATCH /ideas/:id/risks/:riskId
Update a risk.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface RiskUpdateRequest {
  type?: string;
  description?: string;
  severity?: RiskLevel;
}
```

**Response (200):**
```typescript
{ message: "Risk updated successfully" }
```

### DELETE /ideas/:id/risks/:riskId
Delete a risk.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
{ message: "Risk deleted successfully" }
```

### GET /ideas/:id/opportunities
List opportunities (same pattern as risks).

### POST /ideas/:id/opportunities
Create opportunity.

**Request:**
```typescript
interface OpportunityCreateRequest {
  type: string;              // e.g., "Market", "Technology"
  description: string;
  impact: OpportunityImpact;
}
```

### PATCH /ideas/:id/opportunities/:oppId
Update opportunity.

### DELETE /ideas/:id/opportunities/:oppId
Delete opportunity.

---

## Business Models

### GET /ideas/:id/models
List business models for an idea.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface BusinessModelSummary {
  id: UUID;
  name: string;
  revenueMonthlyK: number;     // e.g., 50 = $50K/month
  marginPct: number;           // e.g., 35
  churnPct?: number;           // e.g., 5
}

interface BusinessModelsResponse {
  data: BusinessModelSummary[];
}
```

### POST /ideas/:id/models
Create a business model.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface BusinessModelCreateRequest {
  name: string;
  description: string;
  revenueMonthlyK: number;
  marginPct: number;
  timeToBreakevenMonths: number;
  riskLevel: RiskLevel;
  churnPct?: number;
  assumptions?: string;
}
```

**Response (201):**
```typescript
interface BusinessModelCreateResponse {
  id: UUID;
  message: "Business model created successfully";
}
```

### GET /ideas/:id/models/:modelId
Get detailed business model.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface BusinessModel {
  id: UUID;
  ideaId: UUID;
  name: string;
  description: string;
  revenueMonthlyK: number;
  marginPct: number;
  churnPct?: number;
  timeToBreakevenMonths: number;
  riskLevel: RiskLevel;
  assumptions?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}
```

### PATCH /ideas/:id/models/:modelId
Update business model.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface BusinessModelUpdateRequest {
  name?: string;
  description?: string;
  revenueMonthlyK?: number;
  marginPct?: number;
  timeToBreakevenMonths?: number;
  riskLevel?: RiskLevel;
  churnPct?: number;
  assumptions?: string;
}
```

**Response (200):**
```typescript
{ message: "Business model updated successfully" }
```

### DELETE /ideas/:id/models/:modelId
Delete business model.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
{ message: "Business model deleted successfully" }
```

---

## Analytics & Charts

### GET /ideas/:id/analytics/trend
Get idea-level trend data for charts.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface IdeaTrendPoint {
  period: string;            // e.g., "2025-01" or "Jan"
  revenue: number;           // K units
  cost: number;              // K units
}

interface IdeaTrendResponse {
  data: IdeaTrendPoint[];
}
```

### GET /ideas/:id/models/compare
Get comparison data for all models.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface ModelComparisonPoint {
  modelId: UUID;
  name: string;
  revenueMonthlyK: number;
  marginPct: number;
}

interface ModelComparisonResponse {
  data: ModelComparisonPoint[];
}
```

### GET /ideas/:id/models/:modelId/analytics
Get analytics for specific business model.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface ModelTrendPoint {
  period: string;
  revenue: number;           // K units
  cost: number;              // K units
}

interface ModelAnalyticsResponse {
  trend: ModelTrendPoint[];
  snapshot: {
    revenueMonthlyK: number;
    marginPct: number;
  };
}
```

---

## File Uploads

### POST /uploads/presign
Get presigned upload URL.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface PresignRequest {
  fileName: string;
  mimeType: string;
  size: number;
}
```

**Response (200):**
```typescript
interface PresignResponse {
  uploadUrl: string;         // Direct upload URL
  storageKey: string;        // Reference for later attachment
  headers?: Record<string, string>; // Optional headers for upload
}
```

### POST /ideas/:id/attachments
Link uploaded file to idea.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface AttachmentLinkRequest {
  name: string;
  size: number;
  type: string;
  storageKey: string;        // From presign response
}
```

**Response (201):**
```typescript
interface AttachmentLinkResponse {
  id: UUID;
  message: "File attached successfully";
}
```

### GET /ideas/:id/attachments
List idea attachments.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface AttachmentsResponse {
  data: Attachment[];
}
```

### DELETE /ideas/:id/attachments/:attachmentId
Remove attachment.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
{ message: "Attachment removed successfully" }
```

---

## AI Chat

### POST /ai/threads
Create new AI chat thread.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface AIThreadCreateRequest {
  ideaId: UUID;
  modelId?: UUID;            // Optional: specific model context
  title?: string;            // Optional: custom thread title
}
```

**Response (201):**
```typescript
interface AIThreadCreateResponse {
  id: UUID;
  message: "Thread created successfully";
}
```

### GET /ai/threads
List user's AI threads.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `ideaId?: UUID` - Filter by idea
- `modelId?: UUID` - Filter by model

**Response (200):**
```typescript
interface AIThread {
  id: UUID;
  userId: UUID;
  ideaId: UUID;
  modelId?: UUID;
  title?: string;
  createdAt: ISODate;
  updatedAt: ISODate;
}

interface AIThreadsResponse {
  data: AIThread[];
}
```

### GET /ai/threads/:threadId/messages
Get thread message history.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface AIMessage {
  id: UUID;
  threadId: UUID;
  role: MessageRole;
  content: string;           // Markdown supported
  tokensIn?: number;
  tokensOut?: number;
  createdAt: ISODate;
}

interface AIMessagesResponse {
  data: AIMessage[];
}
```

### POST /ai/threads/:threadId/messages
Send message to AI.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface AIMessageCreateRequest {
  content: string;
  temperature?: number;      // 0.0 - 1.0, default 0.7
  stream?: boolean;          // Use SSE streaming
}
```

**Response (200) - Sync:**
```typescript
interface AIMessageCreateResponse {
  id: UUID;
  content: string;           // AI response
  tokensUsed: number;
  suggestions?: string[];    // Follow-up suggestions
}
```

### POST /ai/threads/:threadId/messages/stream
Send message with SSE streaming.

**Headers:** 
- `Authorization: Bearer <token>`
- `Accept: text/event-stream`

**Request:** Same as above

**Response (200) - SSE Stream:**
```
data: {"type": "token", "content": "Hello"}
data: {"type": "token", "content": " there!"}
data: {"type": "done", "messageId": "uuid", "tokensUsed": 15}
```

---

## Billing & Usage

### GET /billing/usage
Get current usage statistics.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```typescript
interface BillingUsageResponse {
  ideas: {
    used: number;
    limit: number;
  };
  models: {
    used: number;
    limit: number;
  };
  aiMessages: {
    used: number;
    limit: number;
  };
}
```

### GET /billing/history
Get billing/invoice history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page?: number`
- `pageSize?: number`

**Response (200):**
```typescript
interface Invoice {
  id: UUID;
  date: ISODate;
  description: string;
  amount: number;            // In minor units (cents)
  currency: string;          // e.g., "USD"
  status: "paid" | "open" | "failed";
  providerInvoiceId?: string;
  pdfUrl?: string;
}

interface BillingHistoryResponse {
  data: Invoice[];
  pagination: Pagination;
}
```

### POST /billing/checkout/session
Create upgrade checkout session.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```typescript
interface CheckoutSessionRequest {
  plan: "pro" | "enterprise";
  billingCycle: "monthly" | "yearly";
  successUrl?: string;
  cancelUrl?: string;
}
```

**Response (200):**
```typescript
interface CheckoutSessionResponse {
  sessionId: string;         // Stripe/payment provider session ID
  checkoutUrl: string;       // Redirect URL
}
```

---

# Database Schema

## Entity Relationship Diagram

```
users
├─ id (PK)
├─ email (unique)
├─ password_hash
├─ name
├─ avatar_url
├─ plan
├─ created_at
└─ updated_at

user_usage
├─ user_id (PK, FK → users.id)
├─ month (nullable for global snapshot)
├─ ideas_active
├─ models_generated_month
├─ ai_messages_month
├─ ideas_limit
├─ models_limit_month
└─ ai_messages_limit_month

ideas
├─ id (PK)
├─ user_id (FK → users.id)
├─ title
├─ description
├─ category
├─ location
├─ budget_range
├─ timeline_range
├─ target_market
├─ competitors
├─ unique_value
├─ business_model_pref
├─ voice_notes
├─ status
├─ progress
├─ success_score
├─ created_at
├─ updated_at
└─ last_updated

market_analysis
├─ id (PK)
├─ idea_id (unique FK → ideas.id)
├─ market_size_usd
├─ growth_rate_pct
├─ target_customers
├─ competitor_count
├─ market_opportunity
├─ notes
└─ updated_at

business_models
├─ id (PK)
├─ idea_id (FK → ideas.id)
├─ name
├─ description
├─ revenue_monthly_k
├─ margin_pct
├─ churn_pct
├─ time_to_breakeven_months
├─ risk_level
├─ assumptions
├─ created_at
└─ updated_at

risks
├─ id (PK)
├─ idea_id (FK → ideas.id)
├─ type
├─ description
├─ severity
├─ created_at
└─ updated_at

opportunities
├─ id (PK)
├─ idea_id (FK → ideas.id)
├─ type
├─ description
├─ impact
├─ created_at
└─ updated_at

idea_attachments
├─ id (PK)
├─ idea_id (FK → ideas.id)
├─ name
├─ size
├─ type
├─ storage_key
├─ url
└─ uploaded_at

analytics_idea_trend
├─ id (PK)
├─ idea_id (FK → ideas.id)
├─ period
├─ revenue_k
└─ cost_k

analytics_model_trend
├─ id (PK)
├─ idea_id (FK → ideas.id)
├─ model_id (FK → business_models.id)
├─ period
├─ revenue_k
└─ cost_k

ai_threads
├─ id (PK)
├─ user_id (FK → users.id)
├─ idea_id (FK → ideas.id)
├─ model_id (nullable FK → business_models.id)
├─ title
├─ created_at
└─ updated_at

ai_messages
├─ id (PK)
├─ thread_id (FK → ai_threads.id)
├─ role
├─ content
├─ tokens_in
├─ tokens_out
└─ created_at

invoices
├─ id (PK)
├─ user_id (FK → users.id)
├─ provider_invoice_id
├─ date
├─ description
├─ amount_cents
├─ currency
├─ status
└─ pdf_url
```

## SQL Schema (PostgreSQL)

```sql
-- Users and authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- User usage tracking
CREATE TABLE user_usage (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    month DATE, -- NULL for global snapshot, or YYYY-MM-01 for monthly tracking
    ideas_active INTEGER NOT NULL DEFAULT 0,
    models_generated_month INTEGER NOT NULL DEFAULT 0,
    ai_messages_month INTEGER NOT NULL DEFAULT 0,
    ideas_limit INTEGER NOT NULL DEFAULT 3,
    models_limit_month INTEGER NOT NULL DEFAULT 6,
    ai_messages_limit_month INTEGER NOT NULL DEFAULT 50
);

-- Ideas
CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    budget_range VARCHAR(20) CHECK (budget_range IN ('0-1000', '1000-5000', '5000-10000', '10000-25000', '25000-50000', '50000+')),
    timeline_range VARCHAR(20) CHECK (timeline_range IN ('1-3months', '3-6months', '6-12months', '1-2years', '2years+')),
    target_market TEXT,
    competitors TEXT,
    unique_value TEXT,
    business_model_pref VARCHAR(255),
    voice_notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'analyzing', 'completed')),
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    success_score INTEGER NOT NULL DEFAULT 0 CHECK (success_score >= 0 AND success_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_ideas_category ON ideas(category);

-- Market analysis (1:1 with ideas)
CREATE TABLE market_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID UNIQUE NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    market_size_usd NUMERIC(15,2),
    growth_rate_pct NUMERIC(5,2),
    target_customers TEXT,
    competitor_count INTEGER,
    market_opportunity VARCHAR(10) CHECK (market_opportunity IN ('Low', 'Medium', 'High')),
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Business models
CREATE TABLE business_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    revenue_monthly_k NUMERIC(10,2) NOT NULL,
    margin_pct NUMERIC(5,2) NOT NULL,
    churn_pct NUMERIC(5,2),
    time_to_breakeven_months INTEGER NOT NULL,
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
    assumptions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_business_models_idea_id ON business_models(idea_id);

-- Risks
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risks_idea_id ON risks(idea_id);

-- Opportunities
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    impact VARCHAR(10) NOT NULL CHECK (impact IN ('Low', 'Medium', 'High')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_opportunities_idea_id ON opportunities(idea_id);

-- File attachments
CREATE TABLE idea_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    size BIGINT NOT NULL,
    type VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    url TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_idea_attachments_idea_id ON idea_attachments(idea_id);

-- Analytics data (denormalized for performance)
CREATE TABLE analytics_idea_trend (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    period VARCHAR(10) NOT NULL, -- "2025-01" or similar
    revenue_k NUMERIC(10,2) NOT NULL,
    cost_k NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_analytics_idea_trend_idea_id ON analytics_idea_trend(idea_id);

CREATE TABLE analytics_model_trend (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    model_id UUID NOT NULL REFERENCES business_models(id) ON DELETE CASCADE,
    period VARCHAR(10) NOT NULL,
    revenue_k NUMERIC(10,2) NOT NULL,
    cost_k NUMERIC(10,2) NOT NULL
);

CREATE INDEX idx_analytics_model_trend_model_id ON analytics_model_trend(model_id);

-- AI chat threads
CREATE TABLE ai_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
    model_id UUID REFERENCES business_models(id) ON DELETE CASCADE,
    title VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_threads_user_id ON ai_threads(user_id);
CREATE INDEX idx_ai_threads_idea_id ON ai_threads(idea_id);
CREATE INDEX idx_ai_threads_model_id ON ai_threads(model_id);

-- AI messages
CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES ai_threads(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
    content TEXT NOT NULL,
    tokens_in INTEGER,
    tokens_out INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_thread_id ON ai_messages(thread_id);

-- Billing and invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_invoice_id VARCHAR(255),
    date TIMESTAMPTZ NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL CHECK (status IN ('paid', 'open', 'failed')),
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
```

## Relationships Summary

1. **Users** → **Ideas** (1:N)
2. **Ideas** → **Market Analysis** (1:1)
3. **Ideas** → **Business Models** (1:N)
4. **Ideas** → **Risks** (1:N)
5. **Ideas** → **Opportunities** (1:N)
6. **Ideas** → **Attachments** (1:N)
7. **Ideas** → **AI Threads** (1:N)
8. **Business Models** → **AI Threads** (1:N, optional)
9. **AI Threads** → **AI Messages** (1:N)
10. **Users** → **Usage** (1:1)
11. **Users** → **Invoices** (1:N)
12. **Ideas** → **Analytics Trend** (1:N)
13. **Business Models** → **Analytics Trend** (1:N)

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `validation_error` | Request validation failed |
| 401 | `authentication_required` | Missing or invalid token |
| 403 | `insufficient_permissions` | User lacks required permissions |
| 403 | `quota_exceeded` | Usage limit reached |
| 404 | `not_found` | Resource not found |
| 409 | `conflict` | Resource conflict (e.g., duplicate email) |
| 422 | `unprocessable_entity` | Business logic validation failed |
| 429 | `rate_limit_exceeded` | Too many requests |
| 500 | `internal_server_error` | Server error |

## Example Frontend Integration

### Create Idea (from wizard):
```javascript
const response = await fetch('/api/v1/ideas', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: formData.title,
    description: formData.description,
    category: formData.category,
    location: formData.location,
    budgetRange: formData.budget,
    timelineRange: formData.timeline,
    targetMarket: formData.targetMarket,
    competitors: formData.competitors,
    uniqueValue: formData.uniqueValue,
    businessModelPref: formData.businessModel,
    voiceNotes: formData.voiceInput,
    attachments: formData.uploadedFiles
  })
});
```

### AI Chat:
```javascript
// Create thread
const threadResponse = await fetch('/api/v1/ai/threads', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ ideaId: '123', title: 'Model Discussion' })
});

// Send message
const messageResponse = await fetch(`/api/v1/ai/threads/${threadId}/messages`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: 'How can I improve this model?' })
});
```

This specification provides everything needed to implement the backend API that supports all current frontend functionality in BizPilot.