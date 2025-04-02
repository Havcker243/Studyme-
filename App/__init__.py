from flask import Flask
from App.routes import main 
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20MB

    # Enable CORS for all routes
    CORS(app)

    #Register the Blueprint 
    app.register_blueprint(main)

    return app  
