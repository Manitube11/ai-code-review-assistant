import pytest
from unittest.mock import patch, MagicMock

from ai_review.services.llm import analyze_code
from ai_review.models.review import SeverityLevel, ReviewCategory


@pytest.fixture
def mock_openai_response():
    """Mock OpenAI API response fixture."""
    mock_response = MagicMock()
    mock_response.choices[0].message.content = """
    {
        "suggestions": [
            {
                "line_start": 5,
                "line_end": 7,
                "file_path": "example.py",
                "message": "Variable name 'x' is too short and not descriptive",
                "category": "style",
                "severity": "low",
                "suggested_fix": "def calculate_sum(numbers):\\n    total = sum(numbers)\\n    return total"
            },
            {
                "line_start": 12,
                "line_end": 15,
                "file_path": "example.py",
                "message": "Unused import 'os' detected",
                "category": "lint",
                "severity": "medium",
                "suggested_fix": null
            }
        ],
        "summary": "The code has minor style issues and unused imports."
    }
    """
    return mock_response


def test_analyze_code(mock_openai_response):
    """Test that code analysis returns properly structured results."""
    with patch('ai_review.services.llm.client.chat.completions.create', return_value=mock_openai_response):
        result = analyze_code(
            code="def f(x):\n    y = x\n    return y",
            file_path="example.py"
        )
        
        # Check overall structure
        assert "suggestions" in result
        assert "summary" in result
        assert "execution_time" in result
        
        # Check suggestions format
        assert len(result["suggestions"]) == 2
        
        # Check first suggestion
        first_suggestion = result["suggestions"][0]
        assert first_suggestion.line_start == 5
        assert first_suggestion.line_end == 7
        assert first_suggestion.category == ReviewCategory.STYLE
        assert first_suggestion.severity == SeverityLevel.LOW
        assert first_suggestion.suggested_fix is not None
        
        # Check second suggestion
        second_suggestion = result["suggestions"][1]
        assert second_suggestion.category == ReviewCategory.LINT
        assert second_suggestion.severity == SeverityLevel.MEDIUM
        assert second_suggestion.suggested_fix is None
        
        # Check summary
        assert "style issues" in result["summary"]


def test_analyze_code_infers_language():
    """Test that language is correctly inferred from file extension."""
    with patch('ai_review.services.llm.client.chat.completions.create') as mock_create:
        # Test various file extensions
        test_cases = [
            ("example.py", "python"),
            ("code.js", "javascript"),
            ("app.tsx", "typescript"),
            ("style.css", "css"),
            ("unknown.xyz", "unknown")
        ]
        
        for file_path, expected_language in test_cases:
            analyze_code(code="// test code", file_path=file_path)
            
            # Check that system prompt contains the right language
            system_content = mock_create.call_args[1]["messages"][0]["content"]
            assert f"specialized in {expected_language}" in system_content 