# filepath: app/crud/demand_prediction.py
from sqlalchemy.orm import Session
from app.models.demand_prediction import DemandPrediction
from app.schemas.demand_prediction import DemandPredictionRequest

def create_prediction_record(
    db: Session, 
    request_data: DemandPredictionRequest,
    prediction: float,
    user_id: int = None
):
    """Save prediction to database"""
    db_prediction = DemandPrediction(
        user_id=user_id,
        product_name=request_data.product_name,
        region=request_data.region,
        predicted_demand=prediction,
        prediction_date=request_data.date,
        input_parameters=request_data.model_dump()
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_user_predictions(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Get user's prediction history"""
    return db.query(DemandPrediction).filter(
        DemandPrediction.user_id == user_id
    ).offset(skip).limit(limit).all()

def get_prediction_by_id(db: Session, prediction_id: int):
    """Get specific prediction"""
    return db.query(DemandPrediction).filter(
        DemandPrediction.id == prediction_id
    ).first()
