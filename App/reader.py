from PyPDF2 import PdfReader
from PIL import Image
from pdf2image import convert_from_path
import pytesseract
from transformers import pipeline
import docx
# Set Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
poppler_path = r"C:\poppler-24.08.0\Library\bin"

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


def extraxct_pdf(file):
    # Load the PDF file
    reader = PdfReader(file)
    page = reader.pages[0]

    # Attempt to extract text
    answer = page.extract_text()
    if answer and answer.strip():
        return answer
    else:
        print("No selectable text found. Falling back to OCR...")
    
         # Convert PDF page to image
        images = convert_from_path(file, poppler_path=poppler_path)
        text = []
        for image in images:
            # Process image with Tesseract
            text = pytesseract.image_to_string(image[0])
        return text 
    
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
file = "p.pdf"
text = extraxct_pdf(file)
print(summarizer(text, max_length=130, min_length=30, do_sample=False))

