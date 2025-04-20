from datetime import datetime
import uuid
from typing import Dict, Any, List

from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, JSON, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from ai_review.models.review import SeverityLevel, ReviewCategory

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviews = relationship("Review", back_populates="user")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    file_path = Column(String, nullable=False)
    language = Column(String, nullable=True)
    summary = Column(Text, nullable=False)
    execution_time = Column(Float, nullable=False)
    settings = Column(JSON, nullable=True)
    status = Column(String, nullable=False, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="reviews")
    suggestions = relationship("Suggestion", back_populates="review", cascade="all, delete-orphan")


class Suggestion(Base):
    __tablename__ = "suggestions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    line_start = Column(Integer, nullable=False)
    line_end = Column(Integer, nullable=False)
    file_path = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    category = Column(Enum(ReviewCategory), nullable=False)
    severity = Column(Enum(SeverityLevel), nullable=False)
    suggested_fix = Column(Text, nullable=True)
    
    review_id = Column(String, ForeignKey("reviews.id"), nullable=False)
    review = relationship("Review", back_populates="suggestions") 