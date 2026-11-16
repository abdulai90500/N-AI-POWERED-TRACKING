from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.companies import router as companies_router
from app.api.v1.users import router as users_router
from app.api.v1.products import router as products_router
from app.api.v1.production import router as production_router
from app.api.v1.quality import router as quality_router
from app.api.v1.ai_routes import router as ai_router
from app.api.v1.inventory import router as inventory_router
from app.api.v1.distribution import router as distribution_router
from app.api.v1.tracking import router as tracking_router
from app.api.v1.dashboard import router as dashboard_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(companies_router)
api_router.include_router(users_router)
api_router.include_router(products_router)
api_router.include_router(production_router)
api_router.include_router(quality_router)
api_router.include_router(ai_router)
api_router.include_router(inventory_router)
api_router.include_router(distribution_router)
api_router.include_router(tracking_router)
api_router.include_router(dashboard_router)
