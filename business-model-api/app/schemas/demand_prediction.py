# filepath: app/schemas/demand_prediction.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class DemandPredictionRequest(BaseModel):
    product_name: str
    region: str
    date: str  # Format: "YYYY-MM-DD"
    is_weekend: Optional[int] = 0
    bd_season: Optional[str] = "summer"
    event: Optional[str] = "none"
    economic_zone: Optional[str] = "medium"

class DemandPredictionResponse(BaseModel):
    id: Optional[int] = None
    product_name: str
    region: str
    predicted_demand: float
    prediction_date: str
    confidence_level: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True