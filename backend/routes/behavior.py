from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from auth_utils import get_current_user, require_admin

router = APIRouter(prefix="/behavior", tags=["behavior"])


@router.post("/batch")
def receive_events(
    batch: schemas.BehaviorBatch,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    for event in batch.events:
        new_event = models.BehaviorEvent(**event.dict())
        db.add(new_event)
    db.commit()
    return {"message": f"{len(batch.events)} events recorded"}


@router.get("/report")
def get_report(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin)
):
    events = db.query(models.BehaviorEvent).all()
    rage_clicks = [e for e in events if e.event_type == "rage_click"]
    abandoned = [e for e in events if e.event_type == "input_abandon"]

    element_counts = {}
    for e in events:
        key = (e.element_id, e.event_type)
        element_counts[key] = element_counts.get(key, 0) + 1

    top_elements = [
        {"element_id": k[0], "event_type": k[1], "count": v}
        for k, v in sorted(element_counts.items(), key=lambda x: -x[1])[:5]
    ]

    return {
        "rage_clicks": len(rage_clicks),
        "abandoned_inputs": len(abandoned),
        "top_elements": top_elements
    }
