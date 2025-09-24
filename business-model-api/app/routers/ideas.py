from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.schemas.idea import (
    IdeaCreateRequest, IdeaCreateResponse, IdeasListResponse, IdeaDetail, IdeaUpdateRequest,
    MarketAnalysis, MarketAnalysisUpdateRequest, BusinessModelsResponse, BusinessModel,
    BusinessModelCreateRequest, BusinessModelCreateResponse, BusinessModelUpdateRequest,
    RisksResponse, Risk, RiskCreateRequest, RiskCreateResponse, RiskUpdateRequest,
    OpportunitiesResponse, Opportunity, OpportunityCreateRequest, OpportunityCreateResponse,
    OpportunityUpdateRequest, Pagination, IdeaListItem
)
from app.crud.idea import (
    create_idea, get_ideas, get_idea, update_idea, delete_idea,
    get_market_analysis, update_market_analysis,
    get_business_models, get_business_model, create_business_model, update_business_model, delete_business_model,
    get_risks, get_risk, create_risk, update_risk, delete_risk,
    get_opportunities, get_opportunity, create_opportunity, update_opportunity, delete_opportunity
)
from app.auth.jwt import get_current_user
from app.models.user import User

router = APIRouter(prefix="/ideas", tags=["Ideas"])

# Ideas endpoints
@router.get("/", response_model=IdeasListResponse)
def list_ideas(
    search: Optional[str] = Query(None, description="Search in title/description"),
    status: Optional[str] = Query(None, description="Filter by status"),
    category: Optional[str] = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1, description="Page number"),
    pageSize: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List and filter user's ideas"""
    skip = (page - 1) * pageSize
    results, total = get_ideas(db, current_user.id, search, status, category, skip, pageSize)
    
    # Convert results to list items with models count
    idea_items = []
    for result in results:
        if isinstance(result, tuple):
            idea, models_count = result[0], result[1] if len(result) > 1 else 0
        else:
            idea, models_count = result, 0
            
        item = IdeaListItem(
            id=idea.id,
            title=idea.title,
            description=idea.description,
            category=idea.category,
            status=idea.status,
            progress=idea.progress,
            models_count=models_count,
            last_updated=idea.last_updated,
            success_score=idea.success_score
        )
        idea_items.append(item)
    
    return IdeasListResponse(
        data=idea_items,
        pagination=Pagination(page=page, pageSize=pageSize, total=total)
    )

@router.post("/", response_model=IdeaCreateResponse, status_code=201)
def create_new_idea(
    idea: IdeaCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new business idea"""
    db_idea = create_idea(db, idea, current_user.id)
    return IdeaCreateResponse(id=db_idea.id)

@router.get("/{idea_id}", response_model=IdeaDetail)
def get_idea_detail(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed idea information"""
    db_idea = get_idea(db, idea_id, current_user.id)
    if not db_idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return db_idea

@router.patch("/{idea_id}")
def update_idea_info(
    idea_id: str,
    idea_update: IdeaUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update idea information"""
    db_idea = update_idea(db, idea_id, current_user.id, idea_update)
    if not db_idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return {"message": "Idea updated successfully"}

@router.delete("/{idea_id}")
def delete_idea_endpoint(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete/archive an idea"""
    db_idea = delete_idea(db, idea_id, current_user.id)
    if not db_idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return {"message": "Idea deleted successfully"}

# Market Analysis endpoints
@router.get("/{idea_id}/market", response_model=MarketAnalysis)
def get_idea_market_analysis(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get market analysis for an idea"""
    market_analysis = get_market_analysis(db, idea_id, current_user.id)
    if not market_analysis:
        raise HTTPException(status_code=404, detail="Market analysis not found")
    
    return market_analysis

@router.put("/{idea_id}/market")
def update_idea_market_analysis(
    idea_id: str,
    market_update: MarketAnalysisUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update market analysis"""
    market_analysis = update_market_analysis(db, idea_id, current_user.id, market_update)
    if market_analysis is None:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return {"message": "Market analysis updated successfully"}

# Business Models endpoints
@router.get("/{idea_id}/models", response_model=BusinessModelsResponse)
def list_business_models(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List business models for an idea"""
    models = get_business_models(db, idea_id, current_user.id)
    return BusinessModelsResponse(data=models)

@router.post("/{idea_id}/models", response_model=BusinessModelCreateResponse, status_code=201)
def create_new_business_model(
    idea_id: str,
    model: BusinessModelCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a business model"""
    db_model = create_business_model(db, idea_id, current_user.id, model)
    if not db_model:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return BusinessModelCreateResponse(id=db_model.id)

@router.get("/{idea_id}/models/{model_id}", response_model=BusinessModel)
def get_business_model_detail(
    idea_id: str,
    model_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed business model"""
    model = get_business_model(db, idea_id, model_id, current_user.id)
    if not model:
        raise HTTPException(status_code=404, detail="Business model not found")
    
    return model

@router.patch("/{idea_id}/models/{model_id}")
def update_business_model_info(
    idea_id: str,
    model_id: str,
    model_update: BusinessModelUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update business model"""
    model = update_business_model(db, idea_id, model_id, current_user.id, model_update)
    if not model:
        raise HTTPException(status_code=404, detail="Business model not found")
    
    return {"message": "Business model updated successfully"}

@router.delete("/{idea_id}/models/{model_id}")
def delete_business_model_endpoint(
    idea_id: str,
    model_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete business model"""
    model = delete_business_model(db, idea_id, model_id, current_user.id)
    if not model:
        raise HTTPException(status_code=404, detail="Business model not found")
    
    return {"message": "Business model deleted successfully"}

# Risks endpoints
@router.get("/{idea_id}/risks", response_model=RisksResponse)
def list_risks(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List risks for an idea"""
    risks = get_risks(db, idea_id, current_user.id)
    return RisksResponse(data=risks)

@router.post("/{idea_id}/risks", response_model=RiskCreateResponse, status_code=201)
def create_new_risk(
    idea_id: str,
    risk: RiskCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new risk"""
    db_risk = create_risk(db, idea_id, current_user.id, risk)
    if not db_risk:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return RiskCreateResponse(id=db_risk.id)

@router.patch("/{idea_id}/risks/{risk_id}")
def update_risk_info(
    idea_id: str,
    risk_id: str,
    risk_update: RiskUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a risk"""
    risk = update_risk(db, idea_id, risk_id, current_user.id, risk_update)
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    
    return {"message": "Risk updated successfully"}

@router.delete("/{idea_id}/risks/{risk_id}")
def delete_risk_endpoint(
    idea_id: str,
    risk_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a risk"""
    risk = delete_risk(db, idea_id, risk_id, current_user.id)
    if not risk:
        raise HTTPException(status_code=404, detail="Risk not found")
    
    return {"message": "Risk deleted successfully"}

# Opportunities endpoints
@router.get("/{idea_id}/opportunities", response_model=OpportunitiesResponse)
def list_opportunities(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List opportunities for an idea"""
    opportunities = get_opportunities(db, idea_id, current_user.id)
    return OpportunitiesResponse(data=opportunities)

@router.post("/{idea_id}/opportunities", response_model=OpportunityCreateResponse, status_code=201)
def create_new_opportunity(
    idea_id: str,
    opportunity: OpportunityCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create opportunity"""
    db_opportunity = create_opportunity(db, idea_id, current_user.id, opportunity)
    if not db_opportunity:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return OpportunityCreateResponse(id=db_opportunity.id)

@router.patch("/{idea_id}/opportunities/{opportunity_id}")
def update_opportunity_info(
    idea_id: str,
    opportunity_id: str,
    opportunity_update: OpportunityUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update opportunity"""
    opportunity = update_opportunity(db, idea_id, opportunity_id, current_user.id, opportunity_update)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    return {"message": "Opportunity updated successfully"}

@router.delete("/{idea_id}/opportunities/{opportunity_id}")
def delete_opportunity_endpoint(
    idea_id: str,
    opportunity_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete opportunity"""
    opportunity = delete_opportunity(db, idea_id, opportunity_id, current_user.id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    
    return {"message": "Opportunity deleted successfully"}