from pydantic import BaseModel
from typing import List, Optional, Literal


class BusinessModelSummary(BaseModel):
    name: str
    projectedRevenueK: float
    profitMarginPct: float
    breakEvenMonths: int


class RiskItem(BaseModel):
    title: str
    type: str
    severity: Literal["Low", "Medium", "High"]
    description: str


class OpportunityItem(BaseModel):
    title: str
    type: str
    impact: Literal["Low", "Medium", "High"]
    description: str


class MarketAnalysis(BaseModel):
    marketSizeUSD: float
    growthRatePct: float
    targetCustomers: str
    competitorCount: int
    marketOpportunity: Literal["Low", "Medium", "High"]
    updatedAt: Optional[str] = None


class BusinessIdeaRequest(BaseModel):
    title: str
    description: str
    category: str
    location: str
    budgetRange: str
    timelineRange: str
    # Optional extended fields coming from wizard
    target_market_customers: Optional[str] = None
    unique_value_proposition: Optional[str] = None
    revenue_model: Optional[str] = None
    additional_context: Optional[str] = None
    market_size_opportunity: Optional[str] = None
    key_competitors: Optional[str] = None
    competitive_advantage: Optional[str] = None
    market_entry_strategy: Optional[str] = None


class BusinessIdeaAnalysisResponse(BaseModel):
    title: str
    description: str
    category: str
    location: str
    budgetRange: str
    timelineRange: str
    status: str
    successScore: float
    createdAt: str
    lastUpdated: str
    marketAnalysis: MarketAnalysis
    businessModelsSummary: List[BusinessModelSummary]
    risks: List[RiskItem]
    opportunities: List[OpportunityItem]
    # Optional passthroughs
    target_market_customers: Optional[str] = None
    unique_value_proposition: Optional[str] = None
    revenue_model: Optional[str] = None
    additional_context: Optional[str] = None
    market_size_opportunity: Optional[str] = None
    key_competitors: Optional[str] = None
    competitive_advantage: Optional[str] = None
    market_entry_strategy: Optional[str] = None
