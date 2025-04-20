import os
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch

from ai_review.api.main import app
from ai_review.models.review import ReviewSuggestion, SeverityLevel, ReviewCategory

client = TestClient(app)


@pytest.fixture(autouse=True)
def mock_db_dependency(monkeypatch):
    """Mock the database dependency."""
    # This could be enhanced to use an in-memory SQLite for integration tests
    pass


@pytest.fixture
def mock_review_response():
    """Create a mock review response."""
    return {
        "review_id": "123e4567-e89b-12d3-a456-426614174000",
        "suggestions": [
            ReviewSuggestion(
                line_start=5,
                line_end=7,
                file_path="test.py",
                message="Variable name 'x' is too short and not descriptive",
                category=ReviewCategory.REFACTOR,
                severity=SeverityLevel.MEDIUM,
                suggested_fix="Use a more descriptive name like 'counter'"
            )
        ],
        "summary": "The code could be improved with better variable naming.",
        "execution_time": 0.5
    }


def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_review_code(mock_review_response):
    """Test code review endpoint."""
    with patch('ai_review.services.review.create_review', return_value=mock_review_response):
        response = client.post(
            "/review",
            json={
                "code": "def example(): return True",
                "file_path": "example.py"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Check response structure
        assert "review_id" in data
        assert "suggestions" in data
        assert "summary" in data
        assert "execution_time" in data
        
        # Check suggestion details
        assert len(data["suggestions"]) == 1
        suggestion = data["suggestions"][0]
        assert suggestion["category"] == "refactor"
        assert suggestion["severity"] == "medium"
        assert suggestion["line_start"] == 5


def test_get_review(mock_review_response):
    """Test get review endpoint."""
    review_id = "123e4567-e89b-12d3-a456-426614174000"
    
    with patch('ai_review.services.review.get_review', return_value=mock_review_response):
        response = client.get(f"/reviews/{review_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["review_id"] == review_id


def test_rerun_review(mock_review_response):
    """Test rerun review endpoint."""
    review_id = "123e4567-e89b-12d3-a456-426614174000"
    
    with patch('ai_review.services.review.service_rerun_review', return_value=mock_review_response):
        response = client.post(f"/reviews/{review_id}/rerun")
        
        assert response.status_code == 200
        data = response.json()
        assert data["review_id"] == review_id
        assert len(data["suggestions"]) == 1 