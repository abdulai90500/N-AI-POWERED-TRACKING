from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.models.entities import Company, User

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.get("/me")
def get_my_company(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.company_id:
        raise HTTPException(status_code=400, detail="User is not bound to a company")
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return {
        "id": company.id,
        "name": company.name,
        "email": company.email,
        "phone": company.phone,
        "address": company.address,
        "status": company.status,
        "created_at": company.created_at
    }

@router.patch("/me")
def update_my_company(
    data: dict,
    current_user: User = Depends(require_roles("Company Administrator", "Super Administrator")),
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.id == current_user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    for field in ["name", "phone", "address"]:
        if field in data and data[field] is not None:
            setattr(company, field, data[field])
    db.commit()
    db.refresh(company)
    return company

@router.get("", dependencies=[Depends(require_roles("Super Administrator"))])
def list_all_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()
