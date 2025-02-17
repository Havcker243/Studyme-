from pptx import Presentation
from serpapi import GoogleSearch
import json 
import re
from dotenv import load_dotenv
import os 
load_dotenv()
serpapi_key = os.getenv("SERPAPI_KEY")

if not serpapi_key:
    raise ValueError("❌ Error: SERPAPI_KEY is missing. Please set it in the .env file.")

def search_using_bullets(parsed_response):

    """
    Takes the parsed OpenAI response, extracts the 'bullets' list,
    and performs a web search for each term using SerpAPI.
    """
    if not parsed_response or not isinstance(parsed_response, dict) or "bullets" not in parsed_response:
        return {"error": "No valid bullets extracted from OpenAI response."}

    bullets = list(set(parsed_response["bullets"]))  # Extract key terms
    search_results = {}

    serpapi_key = os.getenv("SERPAPI_KEY")  # Ensure API key is set

    for term in bullets:
        params = {
            "q": term,
            "api_key": serpapi_key,
            "num": 3  # Limit to top 5 search results per term
        }
        search = GoogleSearch(params)
        results = search.get_dict().get("organic_results", [])

        search_results[term] = [
            {
                "title": result["title"], 
                 "link": result.get("link", result.get("redirect_link", "No link available"))
            }
               for result in results] # Store search results per key term

    return search_results