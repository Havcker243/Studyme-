from reader import extract_pdf, extract_doc, extract_ppt
from summarizer import summarize_large_text, explain
from search import search_using_bullets
#from cache import cache_summary

def process_file(file_path, file_type):
    """Orchestrates full processing pipeline from file extraction to AI processing."""
    # Step 1: Extract text based on file type
    if file_type == "pdf":
        text = extract_pdf(file_path)
    elif file_type == "docx":
        text = extract_doc(file_path)
    elif file_type == "pptx":
        text = extract_ppt(file_path)
    else:
        raise ValueError("Unsupported file type!")
    
    # Validate if text extraction was successful
    if not text.strip():
        return {"error": "❌ Failed to extract text from document."}

    # Step 2: Summarize & Explain
    # cached_summary = cache_summary(text)
    # if cached_summary:
    #     return cached_summary  # Use cached version if available

    summary = summarize_large_text(text)
    explanation = explain(text)

    # Step 3: Perform Web Search
    search_results = search_using_bullets(explanation)

    # Step 4: Store in cache
    final_result = {
        "summary": summary,
        "explanation": explanation,
        "search_results": search_results
    }
    #cache_summary(text, final_result)

    return final_result
