import uuid
from typing import Dict, Any, List, Optional

from sqlalchemy.orm import Session

from ai_review.db.models import Review, Suggestion
from ai_review.models.review import ReviewRequest, ReviewResponse, ReviewSuggestion
from ai_review.services.llm import analyze_code


def create_review(request: ReviewRequest, db: Session) -> ReviewResponse:
    """
    Create a new code review by analyzing code and storing results.
    """
    # Generate a unique ID for this review
    review_id = str(uuid.uuid4())
    
    # Analyze code using LLM
    analysis_result = analyze_code(
        code=request.code,
        file_path=request.file_path,
        language=request.language,
        settings=request.settings
    )
    
    # Create database record
    db_review = Review(
        id=review_id,
        file_path=request.file_path,
        language=request.language or "unknown",
        summary=analysis_result["summary"],
        execution_time=analysis_result["execution_time"],
        settings=request.settings or {},
        status="completed"
    )
    db.add(db_review)
    
    # Create suggestion records
    for sugg in analysis_result["suggestions"]:
        db_suggestion = Suggestion(
            review_id=review_id,
            line_start=sugg.line_start,
            line_end=sugg.line_end,
            file_path=sugg.file_path,
            message=sugg.message,
            category=sugg.category,
            severity=sugg.severity,
            suggested_fix=sugg.suggested_fix
        )
        db.add(db_suggestion)
    
    db.commit()
    
    # Return API response
    return ReviewResponse(
        review_id=review_id,
        suggestions=analysis_result["suggestions"],
        summary=analysis_result["summary"],
        execution_time=analysis_result["execution_time"]
    )


def get_review(review_id: str, db: Session) -> Optional[ReviewResponse]:
    """
    Retrieve a review by ID.
    """
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        return None
    
    db_suggestions = db.query(Suggestion).filter(Suggestion.review_id == review_id).all()
    
    suggestions = [
        ReviewSuggestion(
            line_start=sugg.line_start,
            line_end=sugg.line_end,
            file_path=sugg.file_path,
            message=sugg.message,
            category=sugg.category,
            severity=sugg.severity,
            suggested_fix=sugg.suggested_fix
        )
        for sugg in db_suggestions
    ]
    
    return ReviewResponse(
        review_id=db_review.id,
        suggestions=suggestions,
        summary=db_review.summary,
        execution_time=db_review.execution_time,
        created_at=db_review.created_at
    )


def list_reviews(skip: int = 0, limit: int = 100, db: Session = None) -> List[Dict[str, Any]]:
    """
    List all reviews with pagination.
    """
    db_reviews = db.query(Review).order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "id": review.id,
            "file_path": review.file_path,
            "language": review.language,
            "summary": review.summary,
            "created_at": review.created_at,
            "status": review.status,
            "suggestion_count": len(review.suggestions)
        }
        for review in db_reviews
    ]


def rerun_review(review_id: str, db: Session) -> ReviewResponse:
    """
    Re-run an existing review with the original code.
    """
    # Get existing review
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if not db_review:
        raise ValueError(f"Review with ID {review_id} not found")
    
    # Get original code from the database
    # Note: In a real implementation, you'd have the code stored
    # For this demo, we'll need to retrieve it from somewhere
    
    # Create a request object using the original settings
    request = ReviewRequest(
        code=get_code_for_review(review_id, db),
        file_path=db_review.file_path,
        language=db_review.language,
        settings=db_review.settings
    )
    
    # Delete previous suggestions
    db.query(Suggestion).filter(Suggestion.review_id == review_id).delete()
    
    # Run analysis again
    analysis_result = analyze_code(
        code=request.code,
        file_path=request.file_path,
        language=request.language,
        settings=request.settings
    )
    
    # Update review record
    db_review.summary = analysis_result["summary"]
    db_review.execution_time = analysis_result["execution_time"]
    
    # Create new suggestion records
    for sugg in analysis_result["suggestions"]:
        db_suggestion = Suggestion(
            review_id=review_id,
            line_start=sugg.line_start,
            line_end=sugg.line_end,
            file_path=sugg.file_path,
            message=sugg.message,
            category=sugg.category,
            severity=sugg.severity,
            suggested_fix=sugg.suggested_fix
        )
        db.add(db_suggestion)
    
    db.commit()
    
    # Return API response
    return ReviewResponse(
        review_id=review_id,
        suggestions=analysis_result["suggestions"],
        summary=analysis_result["summary"],
        execution_time=analysis_result["execution_time"]
    )


def get_code_for_review(review_id: str, db: Session) -> str:
    """
    Get the original code for a review.
    In a real implementation, this would retrieve from storage.
    For demo purposes, we return a sample code.
    """
    # This is a placeholder. In production, you should store and retrieve the actual code.
    return """def example():
    # This is a sample code
    x = 10
    y = 20
    return x + y
""" 