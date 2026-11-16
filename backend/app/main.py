from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.db.seed_data import seed_database
from app.api.v1 import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    # Seed sample operational data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="BeverageTrack AI - Freetown Bottling Quality & Distribution Platform",
    description="Multi-tenant AI-Powered Tracking Information System for Beverage Bottling Companies in Freetown, Sierra Leone",
    version=settings.VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API V1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "location": "Freetown, Sierra Leone",
        "status": "Operational",
        "api_docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "modules": [
            "Authentication & Role-Based Multi-Tenancy",
            "Production Management & Automated Batch Numbering",
            "Quality Control Inspection & Approval Workflow",
            "Batch QR-Code Traceability (Public & Internal)",
            "AI Anomaly Detection & Failure Risk Prediction",
            "Inventory & Multi-Warehouse Tracking",
            "Distribution, Vehicle Dispatch & Delivery Tracking",
            "Executive Dashboard & Reporting Analytics"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "BeverageTrack AI Backend"}
