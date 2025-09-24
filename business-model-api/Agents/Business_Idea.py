from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.database import engine
from app.models import user  # Import to register models
from app.routers.auth import router as auth_router, user_router
from app.business_idea_processor import process_business_idea  # Import the function

# Create database tables
user.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Business Model API",
    description="API for business model generation and user management",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(user_router)

# Pydantic model for input validation
class BusinessIdeaInput(BaseModel):
    title: str
    description: str
    category: str
    location: str
    budgetRange: str
    timelineRange: str
    target_market_customers: Optional[str] = None
    unique_value_proposition: Optional[str] = None
    revenue_model: Optional[str] = None
    additional_context: Optional[str] = None
    market_size_opportunity: Optional[str] = None
    key_competitors: Optional[str] = None
    competitive_advantage: Optional[str] = None
    market_entry_strategy: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to Business Model API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

# New route for processing business idea
@app.post("/business-idea")
async def create_business_idea(idea: BusinessIdeaInput):
    try:
        # Convert Pydantic model to dict for processing
        idea_dict = idea.dict(exclude_none=True)
        # Call the process_business_idea function
        result = process_business_idea(idea_dict)
        
        if result is None:
            raise HTTPException(status_code=500, detail="Error processing business idea")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing business idea: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)