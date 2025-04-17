import json 
import os 
from dotenv import load_dotenv
from openai import OpenAI
import re


load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


def flashcards(text):
    response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system",
                        "content": """ 
                         I want you to go through the whole text and try and 
                         extract the most important things , from concepts to definitionss, examples , facts and details , think like a teacher 
                         and take in consideration mutiple test worthy question from the text and develop a a question with multi -choice and also 
                         develop a question and an answer this should be proccesed in three ways and return the output in a json format 
                         with 2 keys "MCQ" and "Cards.Give me at least **20 Cards** and **20 MCQs** if the content allows. Do your best to extract deep, relevant information"

                         1. **Cards**: Think in a flashcard kind of way help put the question here and then give me the answer for the question also 

                         2. **MCQ**: Should contain the question and 4 other possible answers can be different or similar but they all have to be gotten from the test 
                         the real answer will be one of the options but it should be randomized 

                         Return the result **Strictly** as a raw JSON without Markdown formatting "" like this:
                         **Output Format**
                         {
                            "Cards": [
                                    {"Question": "What is X ?", "answer": "X is ....."},
                                    {"Question": "What is X ?", "answer": "X is ....."}, 
                                    {"Question": "What is X ?", "answer": "X is ....."}, 
                                    {"Question": "What is X ?", "answer": "X is ....."} 
                                    ], 

                            "MCQ": [
                                    {"Question": "Questions Here", "options":[Option1, Option2, Option3 , Option4], "correct_answer": "Option3"}, 
                                    {"Question": "Questions Here", "options":[Option1, Option2, Option3 , Option4], "correct_answer": "Option2"}, 
                                    {"Question": "Questions Here", "options":[Option1, Option2, Option3 , Option4], "correct_answer": "Option1"}, 
                                    {"Question": "Questions Here", "options":[Option1, Option2, Option3 , Option4], "correct_answer": "Option4"}, 
                                    {"Question": "Questions Here", "options":[Option1, Option2, Option3 , Option4], "correct_answer": "Option3"},
                                    {"Question": "Questions Here", "options":[Option1, Option2, Option3 , Option4], "correct_answer": "Option1"}
                                    
                                    ]
                         } 
                         """
                    },

                    {
                        "role": "user",
                        "content": text
                    }
                ]
        )
    answer = response.choices[0].message.content.strip()
    try:
        clean_text = answer.replace("```json", "").replace("```", "").strip()
        parsed_response = json.loads(clean_text)

        #Ensure reponse contains valid flashcards 
        cards = parsed_response.get("Cards", [])
        MCQ = parsed_response.get("MCQ", [])

        if not cards and not MCQ:
            print("Warning : Empty flashcards received from OpenAI.")

            return {"Cards": [], "MCQ": []}
        
        return {"Cards": cards, "MCQ": MCQ}


    except json.JSONDecodeError:
        print("Error: Openapi did not return valid JSON")
        print("Raw Response:", answer)
        return {"Cards": [], "MCQ": []}