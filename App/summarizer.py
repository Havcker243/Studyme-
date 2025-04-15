from dotenv import load_dotenv
from transformers import pipeline
from openai import OpenAI
import json 
import re
import textwrap
import os
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6",framework= "pt")

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

def chunk_text(text, chunk_size=1024):
    """Splits text into smaller chunks with max tokens of 1024 (or less)."""
    if isinstance(text, list):
        text = "\n\n".join(text)

    words = text.split()  # Split text into words
    chunks = []
    current_chunck = []

    for word in words:
        current_chunck.append(word)

        if len(" ".join(current_chunck)) >= chunk_size:
            chunks.append(" ".join(current_chunck))
            current_chunck = []

    if current_chunck:
        chunks.append(" ".join(current_chunck))

    return chunks


def summarize_large_text(text):
    """Summarizes large text by breaking it into chunks and summarizing each separately."""
    text_chunks = chunk_text(text, chunk_size=1024)  # Break text into chunks
    summarized_text = []

    for chunk in text_chunks:
        input_length = len(chunk.split())

        max_len = min(300, int(input_length * 0.5))

        summary = summarizer(chunk, max_length=max_len , min_length=int(max_len* 0.5), do_sample=False)
        summarized_text.append(summary[0]['summary_text'])

    return " ".join(summarized_text).strip()


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
                 - Explain all the **main points**, important details, and core ideas from the text, I want you to touch on it each select part 
                - Use two to three small and larges **examples** to clarify meaning of each part also for easy understanding 
                 - Ensure the explanation is **easy enough for a 5-year-old**, but also **detailed enough for a very genus and gifted college student**.
                 - Always **expand on key ideas** instead of summarizing briefly.
                3. **Notes** : I want you to give expressive notes to try and take the most important concepts and points 
                  - Let it be be optimized , in a list , and still talk about each concepts 
                  - Check and make sure that is is clean and understanable 
                  - Work and try to thinkin the way a teache to try and set test and exams from thuis text when it comes to note taking , be like a harvard student who went to yale and MIT for post grdaduates 
        
                Return the result  **strictly** as a raw JSON without Markdown formatting "" like this :
                {{
                    "bullets": ["key term 1", "key term 2", "key term 3"],
                    "explanation": "Full detailed explanation here.",
                    "Notes" : "Fulle detailed notes  here. "
                }}
                """
            },
            {
                "role":"user",
                "content": text
            }
        ]
    )
    answer = response.choices[0].message.content.strip()
    try:

        # Attempt to parse as JSON
        clean_text = re.sub(r"```json|```", "", answer).strip()
        parsed_response = json.loads(clean_text)
        return parsed_response
    except json.JSONDecodeError:
        print("Error: OpenAI did not return valid JSON. Full response:")
        print(answer)
        return None
