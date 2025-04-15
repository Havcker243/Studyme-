
import os
import tempfile
from typing import Dict, List, Any
import json
import logging

logger = logging.getLogger(__name__)

def check_environment_variables():
    """Check if all required environment variables are set."""
    required_vars = {
        "OPENAI_API_KEY": "OpenAI API key for summarization and explanation",
        "SERPAPI_KEY": "SerpAPI key for web search functionality"
    }
    
    optional_vars = {
        "TESSERACT_PATH": "Path to Tesseract OCR executable (default: 'tesseract')",
        "POPPLER_PATH": "Path to Poppler (for PDF processing, default: 'poppler')"
    }
    
    missing = []
    for var, description in required_vars.items():
        if not os.getenv(var):
            missing.append(f"{var}: {description}")
    
    if missing:
        logger.warning("Missing required environment variables:")
        for var in missing:
            logger.warning(f"  - {var}")
        return False
    
    for var, description in optional_vars.items():
        if not os.getenv(var):
            logger.info(f"Optional variable {var} not set. Using default.")
    
    return True

def save_temp_file(content: bytes, suffix: str) -> str:
    """Save binary content to a temporary file and return the path."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        return tmp.name

def clean_temp_file(file_path: str) -> bool:
    """Delete a temporary file and return success status."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    except Exception as e:
        logger.error(f"Error removing temporary file {file_path}: {str(e)}")
        return False
    return False

def format_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """Format the response data for consistency."""
    formatted = {}
    
    # Process summary
    if "summary" in data:
        formatted["summary"] = data["summary"]
    
    # Process explanation
    if "explanation" in data and isinstance(data["explanation"], dict):
        formatted["explanation"] = data["explanation"]
    
    # Process flashcards
    if "flashcards" in data and isinstance(data["flashcards"], dict):
        formatted["flashcards"] = data["flashcards"]
    
    # Process search results
    if "search_results" in data:
        formatted["search_results"] = data["search_results"]
    
    return formatted
