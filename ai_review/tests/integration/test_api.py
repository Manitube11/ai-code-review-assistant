import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from ai_review.api.main import app
from ai_review.models.review import ReviewCategory, SeverityLevel
from ai_review.services import review as review_service


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def mock_review_response():
    """Mock review response."""
    return {
        "review_id": "123e4567-e89b-12d3-a456-426614174000",
        "suggestions": [
            {
                "line_start": 5,
                "line_end": 7,
                "file_path": "example.py",
                "message": "Function is too complex",
                "category": ReviewCategory.REFACTOR,
                "severity": SeverityLevel.MEDIUM,
                "suggested_fix": "def simplified_function():\n    return True"
            }
        ],
        "summary": "The code needs some refactoring.",
        "execution_time": 1.5
    }


def test_health_check(client):
    """Test health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_review_code(client, mock_review_response):
    """Test code review endpoint."""
    with patch.object(review_service, 'create_review', return_value=mock_review_response):
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


def test_get_review(client, mock_review_response):
    """Test get review endpoint."""
    review_id = "123e4567-e89b-12d3-a456-426614174000"
    
    with patch.object(review_service, 'get_review', return_value=mock_review_response):
        response = client.get(f"/reviews/{review_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["review_id"] == review_id


def test_get_review_not_found(client):
    """Test get review endpoint with non-existent ID."""
    with patch.object(review_service, 'get_review', return_value=None):
        response = client.get("/reviews/nonexistent")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


def test_list_reviews(client):
    """Test list reviews endpoint."""
    mock_reviews = [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "file_path": "example.py",
            "summary": "Good code",
            "language": "python",
            "created_at": "2023-11-01T12:00:00",
            "status": "completed",
            "suggestion_count": 3
        },
        {
            "id": "223e4567-e89b-12d3-a456-426614174001",
            "file_path": "another.js",
            "summary": "Needs work",
            "language": "javascript",
            "created_at": "2023-11-02T12:00:00",
            "status": "completed",
            "suggestion_count": 7
        }
    ]
    
    with patch.object(review_service, 'list_reviews', return_value=mock_reviews):
        response = client.get("/reviews")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["id"] == mock_reviews[0]["id"]
        assert data[1]["file_path"] == mock_reviews[1]["file_path"] 