from flask import Blueprint, request, jsonify, Flask 
from pipelines import process_file
#Blueprint( this is used to organize all the large files and endpoints used in the project )

main = Blueprint("main", __name__)

app = Flask(__name__)

@app.route('/process-file', methods=['POST'])
def process_file_api():
    """API route to handle file uploads and processing."""
    file = request.files['file']
    file_type = file.filename.split('.')[-1]  # Get file extension
    file_path = f"./uploads/{file.filename}"
    
    file.save(file_path)  # Save file temporarily
    
    try:
        result = process_file(file_path, file_type)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)