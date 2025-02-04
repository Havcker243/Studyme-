from PyPDF2 import PdfReader
from PIL import Image
from pdf2image import convert_from_path
import pytesseract
from transformers import pipeline
import docx
import openai
from openai import OpenAI
import os 
from dotenv import load_dotenv
from serpapi import GoogleSearch
import json 

import textwrap
# Set Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
poppler_path = r"C:\poppler-24.08.0\Library\bin"
summarizer = pipeline("summarization", model="facebook/bart-large-cnn",framework= "pt")

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
serpapi_key = os.getenv("SERPAPI_KEY")


def extract_doc(file):
    doc = docx.Document(file)
    text = []
    for paragraphs in doc.paragraphs:
        if paragraphs.text.strip():  # Ignore empty paragraphs
                text.append(paragraphs.text)

    # Extract text from tables
    for table in doc.tables:
        table_data = []
        for row in table.rows:
            row_data = [cell.text.strip() for cell in row.cells]
            table_data.append("\t".join(row_data))  # Tab-separated row
        text.append("\n".join(table_data))  # Add table content as a block
    return "\n\n".join(text)


def extract_pdf(file):
    """Extracts text from a PDF, falls back to OCR if no selectable text is found."""
    reader = PdfReader(file)
    text = ""

    # Extract text from all pages
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text and page_text.strip():
            text += page_text + "\n"
    
    # If no text was extracted, fallback to OCR
    if not text.strip():
        print("No selectable text found. Falling back to OCR...")
        images = convert_from_path(file)
        text = " ".join([pytesseract.image_to_string(img) for img in images])

    return text.strip()

def chunk_text(text, chunk_size=1024):
    """Splits text into smaller chunks with max tokens of 1024 (or less)."""
    words = text.split()  # Split text into words
    chunks = [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    return chunks

def summarize_large_text(text):
    """Summarizes large text by breaking it into chunks and summarizing each separately."""
    text_chunks = chunk_text(text)  # Break text into chunks
    summarized_text = ""

    for chunk in text_chunks:
        summary = summarizer(chunk, max_length=300, min_length=80, do_sample=False)
        summarized_text += summary[0]['summary_text'] + " "

    return summarized_text.strip()


def explain(text):
    response = client .chat.completions.create(
        model= "gpt-4o",
        messages=[
            {
              "role":"developer",
              "content":"""
                I want you to process this text in two ways and return the output in JSON format with two keys: 
                'bullets' and 'explanation'. 

                1. **Bullets**: Extract the key terms from this text in a **simple bullet format**. 
                 - Only include the **most relevant** key terms, important concepts, and main points. 
                - Do NOT explain—just list the terms.

                2. **Explanation**: Take the same text and provide a **detailed** breakdown.
                 - Explain all the **main points**, important details, and core ideas from the text, I want you to touch on it each part 
                - Use **examples** to clarify meaning of each part also for easy understanding 
                 - Ensure the explanation is **easy enough for a 5-year-old**, but also **detailed enough for a 50-year-old expert**.
                 - Always **expand on key ideas** instead of summarizing briefly.

                Return the result  **strictly** as a valid JSON dictionary like this:
                {
                 "bullets": ["key term 1", "key term 2", "key term 3"],
                 "explanation": "Full detailed explanation here."
                }
                """
            },
            {
                "role":"user",
                "content": text
            }
        ]
    )
    try:
        return json.loads(response.choices[0].message.content.strip())
    except json.JSONDecodeError:
        try:
            return eval(response.choices[0].message.content.strip())
        except Exception:
            print("Error: OpenAI did not return valid JSON. Full response:")
            print(response.choices[0].message.content.strip())
            return None

#Work on trying to get the chatgpt api to retuen the result in a format that you can manually read from and then use the search api also to get certain information 

# def Search(text):
#     response = client .chat.completions.create(
#         model= "gpt-4o",
#         messages=[
#             {
#               "role":"developer",
#               "content":"Extract the key terms from this summary in a bullet point format."
                  
#             },
#             {
#                 "role":"user",
#                 "content": text
#             }
#         ]
#     )
#     query = response.choices[0].message.content.strip()

#     params = {
#         "q": query,
#         "api_key": serpapi_key,
#         "num": 7 # Limit to top 5 results
#     }
#     search = GoogleSearch(params)
#     results = search.get_dict()
#     return results.get("organic_results",[])



# Load PDF
file = "p.pdf"
text = extract_pdf(file)

# Summarize in chunks
final_summary = summarize_large_text(text)
explained = explain(text)

# Print result
print("\nFinal Summarized Text:\n", final_summary)
print("\n Everything explaned :\n" , explained)
print(explained["bullets"])