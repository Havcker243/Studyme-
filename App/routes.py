from flask import Blueprint
from flask import Blueprint, request, jsonify
from App.reader import extract_doc, extraxct_pdf
#Blueprint( this is used to organize all the large files and endpoints used in the project )

main = Blueprint("main", __name__)

#The main endpoint for the program
@main.route('/')
def home():
    return "Starting the studyme bot "

@main.route('/summarize', method = ['POST'])

@main.route('/flask_card', method = ['POST'])

@main.route('/summarize', method = ['GET'])

@main.route('/flask_card', method = ['GET'])


@main.route('/parse-doc', method = ['POST'])
def parse_doc():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded!"}), 400

    file = request.files["file"]
    if not (file.filename.lower().endswith(".doc") or file.filename.lower().endswith(".docx")):
        return jsonify({"error": "Invalid file type. Please upload a DOC or DOCX file."}), 400

    try:
        extract_doc(file)
        # return jsonify({"content": text}), 200
    except Exception as e:
            return jsonify({"error": f"Failed to parse Word document: {str(e)}"}), 500
    

@main.route('/parse-pdf', method = ['POST'])
def parse_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded!"}), 400

    file = request.files["file"]
    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Invalid file type. Please upload a PDF."}), 400

    try:
        extraxct_pdf(file)
        # return jsonify({"content": text}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to parse PDF: {str(e)}"}), 500
    

def summarize():
    return "y"