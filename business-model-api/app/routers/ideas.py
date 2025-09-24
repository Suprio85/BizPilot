from fastapi import APIRouter, HTTPException, status
from app.schemas.idea import BusinessIdeaRequest, BusinessIdeaAnalysisResponse
from typing import Any
from Agents.Business_Idea import process_business_idea

router = APIRouter(prefix="/ideas", tags=["Ideas"])  # Authentication temporarily disabled for testing

@router.post("/analyze", response_model=BusinessIdeaAnalysisResponse)
def analyze_business_idea(payload: BusinessIdeaRequest):
    idea_dict = payload.dict()
    result = process_business_idea(idea_dict)
    if not result:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to process business idea")
    return result
