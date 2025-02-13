from flask import Flask, request, jsonify
from flask_cors import CORS  
import joblib
import os
import json
import random

app = Flask(__name__)
CORS(app)

# Paths to models and data
MODEL_PATH = os.path.join("model", "smartinterest_model.pkl")
ENCODER_PATH = os.path.join("model", "label_encoder.pkl")
ROADMAP_PATH = "roadmap_resources.json"
QUESTIONS_PATH = "questions.json"

# Global variables for lazy loading
model = None
label_encoder = None
roadmaps = None
questions_data = None

def load_model():
    """Lazy load the model and label encoder"""
    global model, label_encoder
    if model is None:
        model = joblib.load(MODEL_PATH, mmap_mode="r")
    if label_encoder is None:
        label_encoder = joblib.load(ENCODER_PATH)

def load_roadmaps():
    """Lazy load roadmaps JSON"""
    global roadmaps
    if roadmaps is None:
        with open(ROADMAP_PATH, "r") as f:
            roadmaps = json.load(f)

def load_questions():
    """Lazy load questions JSON"""
    global questions_data
    if questions_data is None:
        with open(QUESTIONS_PATH, "r") as f:
            questions_data = json.load(f)

@app.route("/predict", methods=["POST"])
def predict_interest():
    """Predicts student interest based on marks and projects"""
    load_model()  # Load model only when needed
    load_roadmaps()  # Load roadmaps only when needed

    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Convert input data to model format
    input_data = [
        data.get("Operating System", 0),
        data.get("DSA", 0),
        data.get("Frontend", 0),
        data.get("Backend", 0),
        data.get("Machine Learning", 0),
        data.get("Data Analytics", 0),
        data.get("Project 1", ""),
        data.get("Project 2", ""),
        data.get("Project 3", ""),
        data.get("Project 4", ""),
    ]

    # Make prediction
    prediction = model.predict([input_data])[0]
    interest_label = label_encoder.inverse_transform([prediction])[0]

    # Get full roadmap for predicted interest
    roadmap_info = roadmaps.get(interest_label, {"description": "No roadmap available.", "levels": {}})

    return jsonify({
        "predicted_interest": interest_label,
        "roadmap": roadmap_info
    })

@app.route("/get_questions", methods=["GET"])
def get_questions():
    """Fetch random questions for a subject"""
    load_questions()  # Load questions only when needed

    subject = request.args.get("subject")
    if subject in questions_data:
        questions = questions_data[subject]
        random.shuffle(questions)  # Randomize question order
        return jsonify({"questions": questions})
    else:
        return jsonify({"error": "Subject not found"}), 404

@app.route("/submit_answers", methods=["POST"])
def submit_answers():
    """Evaluate student answers"""
    load_questions()  # Load questions only when needed

    data = request.get_json()
    subject = data.get("subject")
    user_answers = data.get("answers", [])  # List of user's selected answers
    
    if subject not in questions_data:
        return jsonify({"error": "Invalid subject"}), 400

    questions = questions_data[subject]
    correct_answers = {idx: q["answer"] for idx, q in enumerate(questions)}

    score = sum(1 for idx, ans in enumerate(user_answers) if correct_answers.get(idx) == ans)
    total_questions = len(questions)
    percentage = (score / total_questions) * 100 if total_questions else 0

    return jsonify({
        "score": score,
        "total": total_questions,
        "percentage": round(percentage, 2)
    })

@app.route("/roadmaps", methods=["GET"])
def get_roadmaps():
    """Fetch all available roadmaps"""
    load_roadmaps()  # Load roadmaps only when needed
    return jsonify(roadmaps)

if __name__ == "__main__":
    app.run(debug=True)
