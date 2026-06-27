from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas
from auth_utils import get_current_user

router = APIRouter(prefix="/records", tags=["records"])


@router.get("/", response_model=List[schemas.RecordOut])
def get_records(
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    offset = (page - 1) * limit
    if current_user.role == "admin":
        records = db.query(models.BusinessRecord).offset(offset).limit(limit).all()
    else:
        records = db.query(models.BusinessRecord).filter(
            models.BusinessRecord.updated_by == current_user.id
        ).offset(offset).limit(limit).all()
    return records


@router.post("/", response_model=schemas.RecordOut)
def create_record(
    record: schemas.RecordCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_record = models.BusinessRecord(
        **record.dict(),
        updated_by=current_user.id
    )
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{record_id}", response_model=schemas.RecordOut)
def update_record(
    record_id: int,
    data: schemas.RecordUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    record = db.query(models.BusinessRecord).filter(
        models.BusinessRecord.id == record_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    if current_user.role != "admin" and record.updated_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(record, key, value)
    record.updated_by = current_user.id
    db.commit()
    db.refresh(record)
    return record

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role == "admin":
        total = db.query(models.BusinessRecord).count()
        active = db.query(models.BusinessRecord).filter(
            models.BusinessRecord.status == "Active"
        ).count()
        leads = db.query(models.BusinessRecord).filter(
            models.BusinessRecord.status == "Lead"
        ).count()
    else:
        total = db.query(models.BusinessRecord).filter(
            models.BusinessRecord.updated_by == current_user.id
        ).count()
        active = db.query(models.BusinessRecord).filter(
            models.BusinessRecord.updated_by == current_user.id,
            models.BusinessRecord.status == "Active"
        ).count()
        leads = db.query(models.BusinessRecord).filter(
            models.BusinessRecord.updated_by == current_user.id,
            models.BusinessRecord.status == "Lead"
        ).count()
    return {"total": total, "active": active, "leads": leads}
    
@router.delete("/{record_id}")
def delete_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    record = db.query(models.BusinessRecord).filter(
        models.BusinessRecord.id == record_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    if current_user.role != "admin" and record.updated_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(record)
    db.commit()
    return {"message": "Record deleted"}
