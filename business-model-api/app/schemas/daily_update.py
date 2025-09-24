from pydantic import BaseModel, Field
from typing import Optional, List

class SalesDemand(BaseModel):
    units_sold: Optional[int] = None
    new_orders: Optional[int] = None
    product_attention: Optional[str] = ""

class CustomerEngagement(BaseModel):
    inquiries_feedback: Optional[str] = ""
    visits: Optional[int] = None
    new_followers: Optional[int] = None

class MarketingOutreach(BaseModel):
    posted: Optional[str] = "No"
    channel: Optional[str] = ""
    budget: Optional[int] = None

class OperationsSupply(BaseModel):
    issues: Optional[str] = ""
    produced_restock: Optional[int] = None

class ChallengesInsights(BaseModel):
    biggest_challenge: Optional[str] = ""
    new_opportunity: Optional[str] = ""

class DailyUpdateInput(BaseModel):
    date: str = Field(..., description="ISO date for this update")
    sales_demand: SalesDemand
    customer_engagement: CustomerEngagement
    marketing_outreach: MarketingOutreach
    operations_supply: OperationsSupply
    challenges_insights: ChallengesInsights

class DailyUpdateAnalysisRequest(BaseModel):
    update: DailyUpdateInput
    historical: List[DailyUpdateInput] = Field(default_factory=list, description="Prior days updates in chronological order (oldest first)")
    predicted_demand: Optional[dict] = Field(default_factory=dict)

class DailyGuidanceChecklist(BaseModel):
    steps: List[str]

class DailyUpdateAnalysisResponse(BaseModel):
    momentum_score: int
    summary: str
    risks: List[str]
    opportunities: List[str]
    actions: List[str]
    checklist: List[str]
