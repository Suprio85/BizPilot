
# filepath: app/models/demand_prediction.py
from sqlalchemy import Column, Integer, String, DateTime, Float, JSON
from sqlalchemy.sql import func
from app.database import Base

class DemandPrediction(Base):
    __tablename__ = "demand_predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # Optional user association
    product_name = Column(String(200), nullable=False)
    region = Column(String(50), nullable=False)
    predicted_demand = Column(Float, nullable=False)
    prediction_date = Column(String(20), nullable=False)
    input_parameters = Column(JSON, nullable=True)  # Store the full input
    created_at = Column(DateTime(timezone=True), server_default=func.now())
