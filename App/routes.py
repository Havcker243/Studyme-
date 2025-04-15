from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from App.validation import TextPayload, SummaryModePayload
from App.search import search_using_bullets
from App.errors import handle_exceptions
from App.cache import cache_summary
from App.reader import extract_pdf, extract_doc, extract_ppt
from App.summarizer import  summarize_large_text, explain
from App.flashcards import flashcards
import logging

import os
import tempfile

router = APIRouter()
logger = logging.getLogger(__name__)

def validate_file_size(file: UploadFile, max_size_mb: int = 20):
    """Validate that the file doesn't exceed max size"""
    max_size = max_size_mb * 1024 * 1024  # Convert to bytes
    file_size = 0
    file.file.seek(0, 2)  # Move to end of file
    file_size = file.file.tell()  # Get file position (size)
    file.file.seek(0)  # Reset file position to start
    
    if file_size > max_size:
        raise HTTPException(
            status_code=413, 
            detail=f"File too large. Maximum size is {max_size_mb}MB."
        )
    return file

# === File Parsing Endpoints ===

@router.post("/parse-pdf")
@handle_exceptions(500)
async def parse_pdf(file: UploadFile = File(...)):
    file = validate_file_size(file)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        text = extract_pdf(tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
    return {"text": text}

@router.post("/parse-docx")
@handle_exceptions(500)
async def parse_docx(file: UploadFile = File(...)):
    file = validate_file_size(file)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        text = extract_doc(tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
    return {"text": text}
    
@router.post("/parse-pptx")
@handle_exceptions(500)
async def parse_pptx(file: UploadFile = File(...)):
    file = validate_file_size(file)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name
    try:
        text = extract_ppt(tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
    return {"text": text}

# === Text Processing Endpoints ===

@router.post("/summarize")
@handle_exceptions(500)
async def summarize(payload: TextPayload):
    summary = summarize_large_text(payload.text)
    return {"summary": summary}


@router.post("/explain")
@handle_exceptions(500)
async def explain_text(payload: TextPayload):
    explanation = explain(payload.text)
    if explanation is None:
        raise HTTPException(status_code=500, detail="Failed to generate explanation")
    return explanation

@router.post("/flashcards")
@handle_exceptions(500)
async def generate_flashcards(payload: TextPayload):
    fc_data = flashcards(payload.text)
    return fc_data

@router.post("/process-document")
@handle_exceptions(500)
async def process_document(payload: SummaryModePayload):
    """Process a document text to generate summary, explanation, and flashcards"""
    try:
        # Get the text and mode from the payload
        text = payload.text
        mode = payload.mode.strip().lower()
        

        # Initialize optional outputs
        explanation_data = {}
        search_results = {}
        fc_data = {}
        summary = ""

        if mode == "brief":
            # Generate summary
            summary = summarize_large_text(text)

            fc_data = flashcards(text)

        if mode == "detailed":
        
            # Generate explanation with bullets
            explanation_data = explain(text)
        
            # Generate search results from bullets
            search_results = {}
            if explanation_data and "bullets" in explanation_data:
                search_results = search_using_bullets(explanation_data)
        
            # Generate flashcards
            fc_data = flashcards(text)
        
        # Return all data
        return {
        **({"summary": summary} if summary else {}),
        **({"explanation": explanation_data} if explanation_data else {}),
        **({"search_results": search_results} if search_results else {}),
        **({"flashcards": fc_data} if fc_data else {})
        }
    except Exception as e:
        logger.error(f"Error in process_document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

main = router
