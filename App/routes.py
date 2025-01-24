from flask import Blueprint
#Blueprint( this is used to organize all the large files and endpoints used in the project )

main = Blueprint("main", __name__)

#The main endpoint for the program
@main.route('/')
def home():
    return "Starting the studyme bot "

@main.route('/summarize', method = ['POST'])
def summarize():
    