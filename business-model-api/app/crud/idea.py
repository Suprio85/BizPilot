from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_
from typing import Optional, List
from app.models.idea import Idea, MarketAnalysis, BusinessModel, Risk, Opportunity, IdeaAttachment
from app.schemas.idea import (
    IdeaCreateRequest, IdeaUpdateRequest, IdeaListItem,
    MarketAnalysisUpdateRequest, BusinessModelCreateRequest, BusinessModelUpdateRequest,
    RiskCreateRequest, RiskUpdateRequest, OpportunityCreateRequest, OpportunityUpdateRequest
)
import uuid

# Idea CRUD operations
def get_idea(db: Session, idea_id: str, user_id: str):
    """Get a single idea by ID for a specific user"""
    return db.query(Idea).filter(
        Idea.id == idea_id, 
        Idea.user_id == user_id
    ).options(
        joinedload(Idea.market_analysis),
        joinedload(Idea.business_models),
        joinedload(Idea.risks),
        joinedload(Idea.opportunities),
        joinedload(Idea.attachments)
    ).first()

def get_ideas(
    db: Session, 
    user_id: str,
    search: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    skip: int = 0, 
    limit: int = 20
):
    """Get paginated list of ideas for a user with filters"""
    query = db.query(Idea).filter(Idea.user_id == user_id)
    
    # Apply filters
    if search:
        query = query.filter(
            or_(
                Idea.title.ilike(f"%{search}%"),
                Idea.description.ilike(f"%{search}%")
            )
        )
    
    if status:
        query = query.filter(Idea.status == status)
    
    if category:
        query = query.filter(Idea.category == category)
    
    # Add business models count as a subquery
    models_count_subquery = db.query(
        BusinessModel.idea_id,
        func.count(BusinessModel.id).label('models_count')
    ).group_by(BusinessModel.idea_id).subquery()
    
    query = query.outerjoin(models_count_subquery, Idea.id == models_count_subquery.c.idea_id)
    query = query.add_columns(func.coalesce(models_count_subquery.c.models_count, 0).label('models_count'))
    
    # Get total count for pagination
    total = query.count()
    
    # Apply pagination and ordering
    results = query.order_by(Idea.last_updated.desc()).offset(skip).limit(limit).all()
    
    return results, total

def create_idea(db: Session, idea: IdeaCreateRequest, user_id: str):
    """Create a new idea"""
    idea_id = str(uuid.uuid4())
    db_idea = Idea(
        id=idea_id,
        user_id=user_id,
        title=idea.title,
        description=idea.description,
        category=idea.category,
        location=idea.location,
        budget_range=idea.budget_range,
        timeline_range=idea.timeline_range,
        target_market=idea.target_market,
        competitors=idea.competitors,
        unique_value=idea.unique_value,
        business_model_pref=idea.business_model_pref,
        voice_notes=idea.voice_notes
    )
    
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    
    # Create attachments if provided
    if idea.attachments:
        for attachment in idea.attachments:
            db_attachment = IdeaAttachment(
                idea_id=idea_id,
                name=attachment.name,
                size=attachment.size,
                type=attachment.type,
                storage_key=attachment.storage_key
            )
            db.add(db_attachment)
        db.commit()
    
    return db_idea

def update_idea(db: Session, idea_id: str, user_id: str, idea_update: IdeaUpdateRequest):
    """Update an existing idea"""
    db_idea = get_idea(db, idea_id, user_id)
    if not db_idea:
        return None
    
    update_data = idea_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_idea, field, value)
    
    db.commit()
    db.refresh(db_idea)
    return db_idea

def delete_idea(db: Session, idea_id: str, user_id: str):
    """Delete an idea"""
    db_idea = get_idea(db, idea_id, user_id)
    if db_idea:
        db.delete(db_idea)
        db.commit()
    return db_idea

# Market Analysis CRUD operations
def get_market_analysis(db: Session, idea_id: str, user_id: str):
    """Get market analysis for an idea"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return None
    return db.query(MarketAnalysis).filter(MarketAnalysis.idea_id == idea_id).first()

def update_market_analysis(db: Session, idea_id: str, user_id: str, market_update: MarketAnalysisUpdateRequest):
    """Update or create market analysis for an idea"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return None
    
    db_market = db.query(MarketAnalysis).filter(MarketAnalysis.idea_id == idea_id).first()
    
    if db_market:
        # Update existing
        update_data = market_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_market, field, value)
    else:
        # Create new
        db_market = MarketAnalysis(
            idea_id=idea_id,
            **market_update.model_dump(exclude_unset=True)
        )
        db.add(db_market)
    
    db.commit()
    db.refresh(db_market)
    return db_market

# Business Model CRUD operations
def get_business_models(db: Session, idea_id: str, user_id: str):
    """Get all business models for an idea"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return []
    return db.query(BusinessModel).filter(BusinessModel.idea_id == idea_id).all()

def get_business_model(db: Session, idea_id: str, model_id: str, user_id: str):
    """Get a specific business model"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return None
    return db.query(BusinessModel).filter(
        BusinessModel.id == model_id,
        BusinessModel.idea_id == idea_id
    ).first()

def create_business_model(db: Session, idea_id: str, user_id: str, model: BusinessModelCreateRequest):
    """Create a new business model"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return None
    
    db_model = BusinessModel(
        idea_id=idea_id,
        **model.model_dump()
    )
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model

def update_business_model(db: Session, idea_id: str, model_id: str, user_id: str, model_update: BusinessModelUpdateRequest):
    """Update a business model"""
    db_model = get_business_model(db, idea_id, model_id, user_id)
    if not db_model:
        return None
    
    update_data = model_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_model, field, value)
    
    db.commit()
    db.refresh(db_model)
    return db_model

def delete_business_model(db: Session, idea_id: str, model_id: str, user_id: str):
    """Delete a business model"""
    db_model = get_business_model(db, idea_id, model_id, user_id)
    if db_model:
        db.delete(db_model)
        db.commit()
    return db_model

# Risk CRUD operations
def get_risks(db: Session, idea_id: str, user_id: str):
    """Get all risks for an idea"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return []
    return db.query(Risk).filter(Risk.idea_id == idea_id).all()

def get_risk(db: Session, idea_id: str, risk_id: str, user_id: str):
    """Get a specific risk"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return None
    return db.query(Risk).filter(
        Risk.id == risk_id,
        Risk.idea_id == idea_id
    ).first()

def create_risk(db: Session, idea_id: str, user_id: str, risk: RiskCreateRequest):
    """Create a new risk"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return None
    
    db_risk = Risk(
        idea_id=idea_id,
        **risk.model_dump()
    )
    db.add(db_risk)
    db.commit()
    db.refresh(db_risk)
    return db_risk

def update_risk(db: Session, idea_id: str, risk_id: str, user_id: str, risk_update: RiskUpdateRequest):
    """Update a risk"""
    db_risk = get_risk(db, idea_id, risk_id, user_id)
    if not db_risk:
        return None
    
    update_data = risk_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_risk, field, value)
    
    db.commit()
    db.refresh(db_risk)
    return db_risk

def delete_risk(db: Session, idea_id: str, risk_id: str, user_id: str):
    """Delete a risk"""
    db_risk = get_risk(db, idea_id, risk_id, user_id)
    if db_risk:
        db.delete(db_risk)
        db.commit()
    return db_risk

# Opportunity CRUD operations
def get_opportunities(db: Session, idea_id: str, user_id: str):
    """Get all opportunities for an idea"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return []
    return db.query(Opportunity).filter(Opportunity.idea_id == idea_id).all()

def get_opportunity(db: Session, idea_id: str, opportunity_id: str, user_id: str):
    """Get a specific opportunity"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return None
    return db.query(Opportunity).filter(
        Opportunity.id == opportunity_id,
        Opportunity.idea_id == idea_id
    ).first()

def create_opportunity(db: Session, idea_id: str, user_id: str, opportunity: OpportunityCreateRequest):
    """Create a new opportunity"""
    idea = get_idea(db, idea_id, user_id)
    if not idea:
        return None
    
    db_opportunity = Opportunity(
        idea_id=idea_id,
        **opportunity.model_dump()
    )
    db.add(db_opportunity)
    db.commit()
    db.refresh(db_opportunity)
    return db_opportunity

def update_opportunity(db: Session, idea_id: str, opportunity_id: str, user_id: str, opportunity_update: OpportunityUpdateRequest):
    """Update an opportunity"""
    db_opportunity = get_opportunity(db, idea_id, opportunity_id, user_id)
    if not db_opportunity:
        return None
    
    update_data = opportunity_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_opportunity, field, value)
    
    db.commit()
    db.refresh(db_opportunity)
    return db_opportunity

def delete_opportunity(db: Session, idea_id: str, opportunity_id: str, user_id: str):
    """Delete an opportunity"""
    db_opportunity = get_opportunity(db, idea_id, opportunity_id, user_id)
    if db_opportunity:
        db.delete(db_opportunity)
        db.commit()
    return db_opportunity