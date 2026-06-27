from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    email: str
    password: str
    role: Optional[str] = "standard"


class UserOut(BaseModel):
    id: int
    email: str
    role: str

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str


class RecordCreate(BaseModel):
    client_name: str
    deal_value: float
    status: Optional[str] = "Lead"


class RecordUpdate(BaseModel):
    client_name: Optional[str] = None
    deal_value: Optional[float] = None
    status: Optional[str] = None


class RecordOut(BaseModel):
    id: int
    client_name: str
    deal_value: float
    status: str
    updated_by: Optional[int] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class BehaviorEventIn(BaseModel):
    session_id: str
    element_id: str
    event_type: str
    timestamp: str


class BehaviorBatch(BaseModel):
    events: List[BehaviorEventIn]
