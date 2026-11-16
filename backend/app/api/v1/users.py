from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_user, require_roles
from app.core.security import get_password_hash
from app.models.entities import User, AuditLog
from app.schemas.schemas import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("", response_model=List[UserResponse])
def list_company_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if current_user.role != "Super Administrator":
        query = query.filter(User.company_id == current_user.company_id)
    return query.order_by(User.created_at.desc()).all()

@router.post("", response_model=UserResponse)
def create_company_user(
    data: UserCreate,
    current_user: User = Depends(require_roles("Company Administrator", "Super Administrator")),
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    new_user = User(
        company_id=current_user.company_id,
        full_name=data.full_name,
        email=data.email,
        password_hash=get_password_hash(data.password),
        role=data.role,
        is_active=True
    )
    db.add(new_user)
    db.flush()

    audit = AuditLog(
        company_id=current_user.company_id,
        user_id=current_user.id,
        action="CREATE_USER",
        entity_type="user",
        entity_id=new_user.id,
        details=f"Created user {new_user.email} with role {new_user.role}"
    )
    db.add(audit)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.patch("/{user_id}", response_model=UserResponse)
def update_user_status(
    user_id: str,
    data: dict,
    current_user: User = Depends(require_roles("Company Administrator", "Super Administrator")),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if current_user.role != "Super Administrator" and user.company_id != current_user.company_id:
        raise HTTPException(status_code=403, detail="Unauthorized to modify this user")

    for field in ["full_name", "role", "is_active"]:
        if field in data and data[field] is not None:
            setattr(user, field, data[field])
    db.commit()
    db.refresh(user)
    return user
