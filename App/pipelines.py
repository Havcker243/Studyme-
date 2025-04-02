from App.reader import extract_pdf, extract_doc, extract_ppt
from App.summarizer import summarize_large_text, explain
from App.search import search_using_bullets
from App.flashcards import flashcards  # ✅ This was the missing one earlier
import logging
#from cache import cache_summary

logging.basicConfig(level=logging.INFO)

def process_file(file_path, file_type, generate_flashcards=False):
    """Orchestrates full processing pipeline from file extraction to AI processing."""

    logging.info(f"📂 Processing file: {file_path} (Type: {file_type})")
    # Step 1: Extract text based on file type
    if file_type == "pdf":
        text = extract_pdf(file_path)
    elif file_type == "docx":
        text = extract_doc(file_path)
    elif file_type == "pptx":
        text = extract_ppt(file_path)
    else:
        logging.error("Unsupported file type!")
        raise ValueError("Unsupported file type!")
    
    # Validate if text extraction was successful
    if not text.strip():
        logging.error("❌ Failed to extract text from document.")
        return {"error": "❌ Failed to extract text from document."}

    # Step 2: Summarize & Explain
    # cached_summary = cache_summary(text)
    # if cached_summary:
    #     logging.info(" Using cached summary.")
    #     return cached_summary  # Use cached version if available

    try:
        logging.info("Generating simple information......")
        summary = summarize_large_text(text)
        if summary is None:
            summary = "Summary is not avalable"

    except Exception as e:
        logging.error(f"❌ Summarization failed: {str(e)}")
        summary = "❌ Failed to generate summary."


    try: 
        logging.info("Generating explanation & Notes ......")
        explanation = explain(text)
    
    except Exception as e:
        logging.error(f"❌ Explantion failed: {str(e)}")
        explanation = "❌ Failed to generate explanation."

    #Extract notes separately
    if isinstance(explanation, dict):
        Notes = explanation.get("Notes", "Notes not available")
    else:
        Notes = "Notes not available"

        

    # Step 3: Perform Web Search
    if explanation is not None:
        search_results = search_using_bullets(explanation)
    else:
        logging.warning("⚠️ No valid bullet points available for web search or explantion is empty .")
        search_results = "Search did not run"

    flashcards_data = {"Cards": [], "MCQ": []}
    if generate_flashcards:
        try:
            logging.info("Geneating Flashcards")
            flashcards_data = flashcards(text)
        except Exception as e:
            logging.error(f"Flashcard generation failed: {str(e)}")



    # Step 4: Store in cache
    final_result = {
        "summary": summary,
        "explanation": explanation,
        "notes": Notes,
        "search_results": search_results
    }

    if generate_flashcards:
        final_result["flashcards"] = flashcards_data
        
    #cache_summary(text, final_result)

    logging.info("Processing Complete")

    return final_result
 