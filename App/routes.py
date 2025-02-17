from flask import Blueprint, request, jsonify, Flask
from pipelines import process_file
import os

# Create Flask App
app = Flask(__name__)

# Define Blueprint for better API structure
main = Blueprint("main", __name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = {"pdf", "docx", "pptx"}

def allowed_file(filename):
    """Check if uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/process-file', methods=['POST'])
def process_file_api():
    """API route to handle file uploads and processing."""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only PDF, DOCX, and PPTX are allowed."}), 400

    file_type = file.filename.split('.')[-1]  # Get file extension
    upload_dir = "./uploads"

    # Ensure uploads directory exists
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)
    file.save(file_path)  # Save file temporarily

    try:
        result = process_file(file_path, file_type)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Return a 500 error for internal failures

if __name__ == "__main__":
    app.run(debug=True)
