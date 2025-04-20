from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, Field


class SeverityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ReviewCategory(str, Enum):
    LINT = "lint"
    SECURITY = "security"
    PERFORMANCE = "performance"
    STYLE = "style"
    REFACTOR = "refactor"
    DOCUMENTATION = "documentation"
    TEST = "test"


class ReviewSuggestion(BaseModel):
    """Suggestion for code improvement."""
    line_start: int
    line_end: int
    file_path: str
    message: str
    category: ReviewCategory
    severity: SeverityLevel
    suggested_fix: Optional[str] = None


class ReviewRequest(BaseModel):
    """Request payload for code review."""
    code: str
    file_path: str
    language: Optional[str] = None
    settings: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ReviewResponse(BaseModel):
    """Response with review results."""
    review_id: str
    suggestions: List[ReviewSuggestion]
    summary: str
    execution_time: float
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ReviewSession(BaseModel):
    """Complete review session details."""
    id: str
    suggestions: List[ReviewSuggestion]
    summary: str
    execution_time: float
    created_at: datetime
    file_path: str
    language: str
    settings: Dict[str, Any]
    status: str
    user_id: Optional[str] = None 