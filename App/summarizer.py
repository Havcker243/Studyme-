from transformers import pipeline
import textwrap
summarizer = pipeline("summarization", model="facebook/bart-large-cnn",framework= "pt")


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
