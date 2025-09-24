# filepath: app/routers/demand_prediction.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.demand_prediction import DemandPredictionRequest, DemandPredictionResponse
from app.crud.demand_prediction import create_prediction_record, get_user_predictions
from app.services.demand_predictor import demand_predictor
from app.auth.jwt import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/predict", tags=["Demand Prediction"])

@router.post("/demand", response_model=DemandPredictionResponse)
def predict_demand(
    request: DemandPredictionRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Predict 7-day demand for a product
    """
    try:
        # Make prediction using ML model
        prediction = demand_predictor.predict_demand(request.model_dump())
        
        # Save to database
        user_id = current_user.id if current_user else None
        db_prediction = create_prediction_record(db, request, prediction, user_id)
        
        # Determine confidence level based on prediction value
        if prediction > 100:
            confidence = "high"
        elif prediction > 50:
            confidence = "medium"
        else:
            confidence = "low"
        
        return DemandPredictionResponse(
            id=db_prediction.id,
            product_name=request.product_name,
            region=request.region,
            predicted_demand=round(prediction, 2),
            prediction_date=request.date,
            confidence_level=confidence,
            created_at=db_prediction.created_at
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@router.get("/history", response_model=List[DemandPredictionResponse])
def get_prediction_history(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's prediction history"""
    predictions = get_user_predictions(db, current_user.id, skip, limit)
    
    return [
        DemandPredictionResponse(
            id=pred.id,
            product_name=pred.product_name,
            region=pred.region,
            predicted_demand=pred.predicted_demand,
            prediction_date=pred.prediction_date,
            confidence_level="medium",  # You can calculate this based on historical data
            created_at=pred.created_at
        )
        for pred in predictions
    ]

@router.post("/batch", response_model=List[DemandPredictionResponse])
def predict_demand_batch(
    requests: List[DemandPredictionRequest],
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Batch predict demand for multiple products
    """
    if len(requests) > 50:  # Limit batch size
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch size cannot exceed 50 requests"
        )
    
    results = []
    user_id = current_user.id if current_user else None
    
    for request in requests:
        try:
            prediction = demand_predictor.predict_demand(request.model_dump())
            db_prediction = create_prediction_record(db, request, prediction, user_id)
            
            confidence = "high" if prediction > 100 else "medium" if prediction > 50 else "low"
            
            results.append(DemandPredictionResponse(
                id=db_prediction.id,
                product_name=request.product_name,
                region=request.region,
                predicted_demand=round(prediction, 2),
                prediction_date=request.date,
                confidence_level=confidence,
                created_at=db_prediction.created_at
            ))
        except Exception as e:
            # Log error but continue with other predictions
            print(f"Error predicting for {request.product_name}: {e}")
            continue
    
    return results

@router.get("/model/status")
def get_model_status():
    """Get model loading status"""
    return {
        "model_loaded": demand_predictor.model_loaded,
        "model_path": str(demand_predictor.model_dir),
        "status": "ready" if demand_predictor.model_loaded else "not_loaded"
    }

@router.post("/model/reload")
def reload_model():
    """Reload the model (admin function)"""
    try:
        success = demand_predictor.load_model_files()
        return {
            "success": success,
            "message": "Model reloaded successfully" if success else "Failed to reload model"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model reload failed: {str(e)}"
        )
