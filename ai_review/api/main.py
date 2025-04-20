import os
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from ai_review.db.database import get_db, init_db
from ai_review.models.review import ReviewRequest, ReviewResponse
from ai_review.services.review import create_review, get_review, list_reviews, rerun_review as service_rerun_review

# Initialize FastAPI app
app = FastAPI(
    title="AI Code Review API",
    description="API for AI-powered code review and analysis",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/review", response_model=ReviewResponse)
def review_code(payload: ReviewRequest, db: Session = Depends(get_db)):
    """Submit code for review and analysis."""
    return create_review(payload, db)


@app.get("/reviews/{review_id}", response_model=ReviewResponse)
def get_review_by_id(review_id: str, db: Session = Depends(get_db)):
    """Get a specific review by ID."""
    review = get_review(review_id, db)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with ID {review_id} not found"
        )
    return review


@app.post("/reviews/{review_id}/rerun", response_model=ReviewResponse)
def rerun_review(review_id: str, db: Session = Depends(get_db)):
    """Re-run a review with the same code."""
    try:
        return service_rerun_review(review_id, db)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to rerun review: {str(e)}"
        )


@app.get("/reviews", response_model=List[Dict[str, Any]])
def get_reviews(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """List all reviews with pagination."""
    try:
        return list_reviews(skip, limit, db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list reviews: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000"))) 