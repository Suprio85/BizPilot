# filepath: app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models import user, demand_prediction  # Import to register models
from app.routers.auth import router as auth_router, user_router
from app.routers.demand_prediction import router as prediction_router

# Create database tables
user.Base.metadata.create_all(bind=engine)
demand_prediction.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Business Model API",
    description="API for business model generation and demand prediction",
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
app.include_router(prediction_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Business Model API with Demand Prediction"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
