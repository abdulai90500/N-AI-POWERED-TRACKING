from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.db.session import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.deps import get_current_user
from app.models.entities import User, Company, AuditLog
from app.schemas.schemas import Token, LoginRequest, RegisterCompanyRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_company(data: RegisterCompanyRequest, db: Session = Depends(get_db)):
    # Check if company email or user email exists
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    # Create company
    company = Company(
        name=data.company_name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        status="active"
    )
    db.add(company)
    db.flush()

    # Create Company Administrator
    user = User(
        company_id=company.id,
        full_name=data.admin_name,
        email=data.email,
        password_hash=get_password_hash(data.password),
        role="Company Administrator",
        is_active=True
    )
    db.add(user)
    db.flush()

    # Log audit
    audit = AuditLog(
        company_id=company.id,
        user_id=user.id,
        action="REGISTER_COMPANY",
        entity_type="company",
        entity_id=company.id,
        details=f"Company '{company.name}' registered by {user.full_name}"
    )
    db.add(audit)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "company_id": user.company_id,
            "company_name": company.name
        }
    }

@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")

    company_name = ""
    if user.company_id:
        company = db.query(Company).filter(Company.id == user.company_id).first()
        if company:
            company_name = company.name

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "company_id": user.company_id,
            "company_name": company_name
        }
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    company_name = ""
    company_data = None
    if current_user.company_id:
        company = db.query(Company).filter(Company.id == current_user.company_id).first()
        if company:
            company_name = company.name
            company_data = {
                "id": company.id,
                "name": company.name,
                "email": company.email,
                "phone": company.phone,
                "address": company.address,
                "status": company.status
            }

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "company_id": current_user.company_id,
        "company_name": company_name,
        "company": company_data
    }

@router.get("/demo-accounts")
def get_demo_accounts(db: Session = Depends(get_db)):
    """Returns available pre-seeded demo user accounts for immediate testing across all roles."""
    users = db.query(User).all()
    demo_list = []
    for u in users[:6]:
        company_name = u.company.name if u.company else "Platform System"
        demo_list.append({
            "email": u.email,
            "role": u.role,
            "full_name": u.full_name,
            "company": company_name,
            "password": "Password123!"
        })
    return {"demo_accounts": demo_list}
