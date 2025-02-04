from flask import Flask
from App.routes import main 

def create_app():
    app = Flask(__name__)

    #Register the Blueprint 
    app.register_blueprint(main)

    return app  
