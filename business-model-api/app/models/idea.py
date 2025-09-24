from sqlalchemy import Column, String, DateTime, Integer, Text, ForeignKey, Numeric
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import uuid

class Idea(Base):
    __tablename__ = "ideas"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    location = Column(String(255), nullable=True)
    budget_range = Column(String(20), nullable=True)  # 0-1000, 1000-5000, etc.
    timeline_range = Column(String(20), nullable=True)  # 1-3months, 3-6months, etc.
    target_market = Column(Text, nullable=True)
    competitors = Column(Text, nullable=True)
    unique_value = Column(Text, nullable=True)
    business_model_pref = Column(String(255), nullable=True)
    voice_notes = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="draft")  # draft, analyzing, completed
    progress = Column(Integer, nullable=False, default=0)  # 0-100
    success_score = Column(Integer, nullable=False, default=0)  # 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="ideas")
    market_analysis = relationship("MarketAnalysis", back_populates="idea", uselist=False)
    business_models = relationship("BusinessModel", back_populates="idea")
    risks = relationship("Risk", back_populates="idea")
    opportunities = relationship("Opportunity", back_populates="idea")
    attachments = relationship("IdeaAttachment", back_populates="idea")

class MarketAnalysis(Base):
    __tablename__ = "market_analysis"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False, unique=True)
    market_size_usd = Column(Numeric(15,2), nullable=True)
    growth_rate_pct = Column(Numeric(5,2), nullable=True)
    target_customers = Column(Text, nullable=True)
    competitor_count = Column(Integer, nullable=True)
    market_opportunity = Column(String(10), nullable=True)  # Low, Medium, High
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    idea = relationship("Idea", back_populates="market_analysis")

class BusinessModel(Base):
    __tablename__ = "business_models"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    revenue_monthly_k = Column(Numeric(10,2), nullable=False)
    margin_pct = Column(Numeric(5,2), nullable=False)
    churn_pct = Column(Numeric(5,2), nullable=True)
    time_to_breakeven_months = Column(Integer, nullable=False)
    risk_level = Column(String(10), nullable=False)  # Low, Medium, High
    assumptions = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    idea = relationship("Idea", back_populates="business_models")

class Risk(Base):
    __tablename__ = "risks"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False, index=True)
    type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(10), nullable=False)  # Low, Medium, High
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    idea = relationship("Idea", back_populates="risks")

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False, index=True)
    type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    impact = Column(String(10), nullable=False)  # Low, Medium, High
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    idea = relationship("Idea", back_populates="opportunities")

class IdeaAttachment(Base):
    __tablename__ = "idea_attachments"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False, index=True)
    name = Column(String(500), nullable=False)
    size = Column(Integer, nullable=False)  # File size in bytes
    type = Column(String(255), nullable=False)  # MIME type
    storage_key = Column(String(500), nullable=False)
    url = Column(Text, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    idea = relationship("Idea", back_populates="attachments")