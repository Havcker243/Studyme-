from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from App.reader import extract_pdf, extract_doc, extract_ppt
from App.summarizer import chunk_text, summarize_large_text, explain
from App.flashcards import flashcards

import os
import tempfile

router = APIRouter()

# === File Parsing Endpoints ===

@router.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        text = extract_pdf(tmp_path)
        os.remove(tmp_path)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

@router.post("/parse-docx")
async def parse_docx(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        text = extract_doc(tmp_path)
        os.remove(tmp_path)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse DOCX: {str(e)}")

@router.post("/parse-pptx")
async def parse_pptx(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        text = extract_ppt(tmp_path)
        os.remove(tmp_path)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PPTX: {str(e)}")


# === Text Processing Endpoints ===

@router.post("/summarize")
async def summarize(payload: dict):
    try:
        text = payload.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="Missing text")
        summary = summarize_large_text(text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@router.post("/explain")
async def explain_text(payload: dict):
    try:
        text = payload.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="Missing text")
        explanation = explain(text)
        return explanation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")

@router.post("/flashcards")
async def generate_flashcards(payload: dict):
    try:
        text = payload.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="Missing text")
        fc_data = flashcards(text)
        return fc_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Flashcard generation failed: {str(e)}")

main = router
