from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# Common types
class Pagination(BaseModel):
    page: int
    pageSize: int
    total: int

# Attachment schemas
class AttachmentInput(BaseModel):
    name: str
    size: int
    type: str  # MIME type
    storage_key: str  # from presigned upload

class Attachment(BaseModel):
    id: str
    name: str
    size: int
    type: str
    storage_key: str
    url: Optional[str] = None  # signed download URL
    uploaded_at: datetime

    class Config:
        from_attributes = True

# Idea schemas
class IdeaBase(BaseModel):
    title: str
    description: str
    category: str

class IdeaCreateRequest(IdeaBase):
    location: Optional[str] = None
    budget_range: Optional[str] = None
    timeline_range: Optional[str] = None
    target_market: Optional[str] = None
    competitors: Optional[str] = None
    unique_value: Optional[str] = None
    business_model_pref: Optional[str] = None
    voice_notes: Optional[str] = None
    attachments: Optional[List[AttachmentInput]] = None

class IdeaUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    budget_range: Optional[str] = None
    timeline_range: Optional[str] = None
    target_market: Optional[str] = None
    competitors: Optional[str] = None
    unique_value: Optional[str] = None
    business_model_pref: Optional[str] = None
    voice_notes: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    success_score: Optional[int] = None

class IdeaListItem(BaseModel):
    id: str
    title: str
    description: str
    category: str
    status: str
    progress: int  # 0-100
    models_count: int = 0
    last_updated: datetime
    success_score: int  # 0-100

    class Config:
        from_attributes = True

class IdeaCreateResponse(BaseModel):
    id: str
    message: str = "Idea created successfully"

class IdeasListResponse(BaseModel):
    data: List[IdeaListItem]
    pagination: Pagination

# Market Analysis schemas
class MarketAnalysis(BaseModel):
    idea_id: str
    market_size_usd: Optional[Decimal] = None
    growth_rate_pct: Optional[Decimal] = None
    target_customers: Optional[str] = None
    competitor_count: Optional[int] = None
    market_opportunity: Optional[str] = None  # Low, Medium, High
    notes: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True

class MarketAnalysisUpdateRequest(BaseModel):
    market_size_usd: Optional[Decimal] = None
    growth_rate_pct: Optional[Decimal] = None
    target_customers: Optional[str] = None
    competitor_count: Optional[int] = None
    market_opportunity: Optional[str] = None
    notes: Optional[str] = None

# Business Model schemas
class BusinessModelSummary(BaseModel):
    id: str
    name: str
    revenue_monthly_k: Decimal  # e.g., 50 = $50K/month
    margin_pct: Decimal  # e.g., 35
    churn_pct: Optional[Decimal] = None  # e.g., 5

    class Config:
        from_attributes = True

class BusinessModelCreateRequest(BaseModel):
    name: str
    description: str
    revenue_monthly_k: Decimal
    margin_pct: Decimal
    time_to_breakeven_months: int
    risk_level: str  # Low, Medium, High
    churn_pct: Optional[Decimal] = None
    assumptions: Optional[str] = None

class BusinessModelUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    revenue_monthly_k: Optional[Decimal] = None
    margin_pct: Optional[Decimal] = None
    time_to_breakeven_months: Optional[int] = None
    risk_level: Optional[str] = None
    churn_pct: Optional[Decimal] = None
    assumptions: Optional[str] = None

class BusinessModel(BaseModel):
    id: str
    idea_id: str
    name: str
    description: str
    revenue_monthly_k: Decimal
    margin_pct: Decimal
    churn_pct: Optional[Decimal] = None
    time_to_breakeven_months: int
    risk_level: str
    assumptions: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BusinessModelCreateResponse(BaseModel):
    id: str
    message: str = "Business model created successfully"

class BusinessModelsResponse(BaseModel):
    data: List[BusinessModelSummary]

# Risk schemas
class Risk(BaseModel):
    id: str
    idea_id: str
    type: str  # e.g., "Market", "Supply Chain"
    description: str
    severity: str  # Low, Medium, High
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RiskCreateRequest(BaseModel):
    type: str
    description: str
    severity: str

class RiskUpdateRequest(BaseModel):
    type: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[str] = None

class RiskCreateResponse(BaseModel):
    id: str
    message: str = "Risk created successfully"

class RisksResponse(BaseModel):
    data: List[Risk]

# Opportunity schemas
class Opportunity(BaseModel):
    id: str
    idea_id: str
    type: str  # e.g., "Market", "Technology"
    description: str
    impact: str  # Low, Medium, High
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OpportunityCreateRequest(BaseModel):
    type: str
    description: str
    impact: str

class OpportunityUpdateRequest(BaseModel):
    type: Optional[str] = None
    description: Optional[str] = None
    impact: Optional[str] = None

class OpportunityCreateResponse(BaseModel):
    id: str
    message: str = "Opportunity created successfully"

class OpportunitiesResponse(BaseModel):
    data: List[Opportunity]

# Detailed Idea Response (with embedded resources)
class IdeaDetail(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    category: str
    location: Optional[str] = None
    budget_range: Optional[str] = None
    timeline_range: Optional[str] = None
    target_market: Optional[str] = None
    competitors: Optional[str] = None
    unique_value: Optional[str] = None
    business_model_pref: Optional[str] = None
    voice_notes: Optional[str] = None
    attachments: List[Attachment] = []
    status: str
    progress: int  # 0-100
    success_score: int  # 0-100
    created_at: datetime
    last_updated: datetime
    
    # Embedded sub-resources (optional)
    market_analysis: Optional[MarketAnalysis] = None
    business_models_summary: Optional[List[BusinessModelSummary]] = None
    risks: Optional[List[Risk]] = None
    opportunities: Optional[List[Opportunity]] = None

    class Config:
        from_attributes = True