from PyPDF2 import PdfReader
from PIL import Image
from pdf2image import convert_from_path
import pytesseract
import docx
# Set Tesseract executable path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
poppler_path = r"C:\poppler-24.08.0\Library\bin"

def extract_doc(file):
    doc = docx.Document(file)
    for i in range(len(doc.paragraphs)):
        return doc.paragraphs[i].text




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
        images = convert_from_path('p.pdf', first_page=1, last_page=1, poppler_path=poppler_path)
    
         # Process image with Tesseract
        text = pytesseract.image_to_string(images[0])
        return text 

