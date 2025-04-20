import os
import time
import json
from typing import List, Dict, Any, Optional

import openai
from openai import OpenAI

from ai_review.models.review import ReviewSuggestion, SeverityLevel, ReviewCategory

# Initialize OpenAI client if API key is available
api_key = os.getenv("OPENAI_API_KEY")
use_mock = api_key == "your_real_api_key_here" or not api_key
if not use_mock:
    client = OpenAI(api_key=api_key)

def analyze_code(
    code: str, 
    file_path: str, 
    language: Optional[str] = None,
    settings: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Analyze code using OpenAI's GPT-4 to find issues and suggest improvements.
    If no API key is provided, return mock data for testing.
    """
    start_time = time.time()
    
    if not language:
        # Try to infer language from file extension
        extension = file_path.split(".")[-1].lower()
        language_map = {
            "py": "python",
            "js": "javascript",
            "ts": "typescript",
            "jsx": "javascript",
            "tsx": "typescript",
            "html": "html",
            "css": "css",
            "java": "java",
            "c": "c",
            "cpp": "c++",
            "go": "go",
            "rs": "rust",
            "rb": "ruby",
            "php": "php",
        }
        language = language_map.get(extension, "unknown")
    
    # Use mock data if no API key
    if use_mock:
        return _mock_analyze_code(code, file_path, language, settings, start_time)
    
    # Configure analysis based on settings
    settings = settings or {}
    focus_areas = settings.get("focus_areas", ["lint", "security", "performance", "style", "refactor"])
    min_severity = settings.get("min_severity", "low")
    
    system_prompt = f"""
    You are an expert code reviewer specialized in {language}. Analyze the provided code and provide detailed review feedback.
    Focus on these areas: {', '.join(focus_areas)}
    
    Your response should be in the following JSON format ONLY with no additional text:
    {{
        "suggestions": [
            {{
                "line_start": <int>,
                "line_end": <int>,
                "file_path": "<string>",
                "message": "<string>",
                "category": "<category>",
                "severity": "<severity>",
                "suggested_fix": "<string or null>"
            }}
        ],
        "summary": "<overall summary of the code quality and main issues>"
    }}
    
    Categories must be one of: lint, security, performance, style, refactor, documentation, test
    Severity levels must be one of: low, medium, high, critical
    Only include suggestions with severity of {min_severity} or higher.
    
    Be specific in your suggestions and provide concrete examples of how to fix the issues when possible.
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"File: {file_path}\n\n```{language}\n{code}\n```"}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Convert JSON to ReviewSuggestion objects
        suggestions = []
        for sugg in result.get("suggestions", []):
            suggestions.append(
                ReviewSuggestion(
                    line_start=sugg["line_start"],
                    line_end=sugg["line_end"],
                    file_path=sugg.get("file_path", file_path),
                    message=sugg["message"],
                    category=sugg["category"],
                    severity=sugg["severity"],
                    suggested_fix=sugg.get("suggested_fix")
                )
            )
        
        execution_time = time.time() - start_time
        
        return {
            "suggestions": suggestions,
            "summary": result.get("summary", ""),
            "execution_time": execution_time
        }
        
    except Exception as e:
        # Log error and return empty result
        print(f"Error analyzing code: {str(e)}")
        return {
            "suggestions": [],
            "summary": f"Error analyzing code: {str(e)}",
            "execution_time": time.time() - start_time
        }

def _mock_analyze_code(
    code: str, 
    file_path: str, 
    language: str,
    settings: Optional[Dict[str, Any]] = None,
    start_time: float = None
) -> Dict[str, Any]:
    """Provide mock code analysis for testing without API key."""
    if start_time is None:
        start_time = time.time()
        
    # Create sample suggestions based on code length and language
    suggestions = []
    
    # Add a few mock suggestions
    if language == "python":
        suggestions.append(
            ReviewSuggestion(
                line_start=1,
                line_end=1,
                file_path=file_path,
                message="Consider adding type annotations to improve code readability and enable static type checking.",
                category=ReviewCategory.STYLE,
                severity=SeverityLevel.LOW,
                suggested_fix="Add type hints to function parameters and return values."
            )
        )
        
        if "import " in code:
            suggestions.append(
                ReviewSuggestion(
                    line_start=1,
                    line_end=2,
                    file_path=file_path,
                    message="Organize imports according to PEP8: standard library, third-party, local application imports.",
                    category=ReviewCategory.STYLE,
                    severity=SeverityLevel.LOW,
                    suggested_fix=None
                )
            )
            
    elif language in ["javascript", "typescript"]:
        suggestions.append(
            ReviewSuggestion(
                line_start=1,
                line_end=1,
                file_path=file_path,
                message="Consider using const instead of let for variables that are not reassigned.",
                category=ReviewCategory.STYLE,
                severity=SeverityLevel.LOW,
                suggested_fix="Replace 'let' with 'const' for variables that don't change."
            )
        )
    
    # Add a generic suggestion for all languages
    suggestions.append(
        ReviewSuggestion(
            line_start=len(code.splitlines()) // 2,
            line_end=len(code.splitlines()) // 2,
            file_path=file_path,
            message="Add comments to explain complex logic and improve code maintainability.",
            category=ReviewCategory.DOCUMENTATION,
            severity=SeverityLevel.MEDIUM,
            suggested_fix=None
        )
    )
    
    return {
        "suggestions": suggestions,
        "summary": f"Demo code review for {language} code. {len(suggestions)} suggestions were generated.",
        "execution_time": time.time() - start_time
    } 