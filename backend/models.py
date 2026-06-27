from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="standard")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BusinessRecord(Base):
    __tablename__ = "business_records"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, nullable=False)
    deal_value = Column(Float, nullable=False)
    status = Column(String, default="Lead")
    updated_by = Column(Integer, ForeignKey("users.id"))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class BehaviorEvent(Base):
    __tablename__ = "behavior_events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, nullable=False)
    element_id = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
