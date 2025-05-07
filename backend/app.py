from flask import Flask, request, jsonify
from flask_cors import CORS  
import joblib
import numpy as np
import os
import json
import random
from db import users_collection

app = Flask(__name__)
CORS(app)

model_path = os.path.join("model", "smartinterest_model.pkl")
label_encoder_path = os.path.join("model", "label_encoder.pkl")
roadmap_path = "roadmap_resources.json"

model = joblib.load(model_path)
label_encoder = joblib.load(label_encoder_path)

with open(roadmap_path, "r") as f:
    roadmaps = json.load(f)

@app.route("/store_user", methods=["POST"])
def store_user():
    data = request.json
    user_id = data.get("uid")
    email = data.get("email")
    name = data.get("name")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    existing_user = users_collection.find_one({"uid": user_id})
    if not existing_user:
        users_collection.insert_one({
            "uid": user_id,
            "email": email,
            "name": name,
            "scores": {},  
            "projects": [],  
            "predicted_interest": None,
            "roadmap": None
        })
    return jsonify({"message": "User stored successfully!"})

@app.route("/get_user_data", methods=["GET"])
def get_user_data():
    user_id = request.args.get("uid")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    user_data = users_collection.find_one({"uid": user_id}, {"_id": 0})
    if not user_data:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user_data)

@app.route("/update_marks", methods=["POST"])
def update_marks():
    data = request.json
    user_id = data.get("uid")
    subject = data.get("subject")
    new_mark = data.get("mark")
    if not user_id or not subject or new_mark is None:
        return jsonify({"error": "Missing required data"}), 400
    user = users_collection.find_one({"uid": user_id})
    if user:
        existing_marks = user.get("marks", {}).get(subject, [])
        updated_marks = (existing_marks + [new_mark])[-3:]  # Keep last 3
        users_collection.update_one({"uid": user_id}, {"$set": {f"marks.{subject}": updated_marks}})
        return jsonify({"message": "Marks updated successfully!"})
    return jsonify({"error": "User not found"}), 404

@app.route("/store_prediction", methods=["POST"])
def store_prediction():
    data = request.json
    user_id = data.get("uid")
    predicted_interest = data.get("predicted_interest")
    roadmap = data.get("roadmap")
    if not user_id or not predicted_interest or not roadmap:
        return jsonify({"error": "Missing required data"}), 400
    users_collection.update_one(
        {"uid": user_id},
        {"$set": {"predicted_interest": predicted_interest, "roadmap": roadmap}}
    )
    return jsonify({"message": "Interest prediction stored successfully!"})

@app.route("/predict", methods=["POST"])
def predict_interest():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    try:
        input_data = np.array([
            float(data["Operating System"]),
            float(data["DSA"]),
            float(data["Frontend"]),
            float(data["Backend"]),
            float(data["Machine Learning"]),
            float(data["Data Analytics"]),
            int(data["Project 1"]),
            int(data["Project 2"]),
            int(data["Project 3"]),
            int(data["Project 4"]),
        ]).reshape(1, -1)
        prediction = model.predict(input_data)[0]
        interest_label = label_encoder.inverse_transform([prediction])[0]
        roadmap_info = roadmaps.get(interest_label, {"description": "No roadmap available.", "levels": {}})
        return jsonify({
            "predicted_interest": interest_label,
            "roadmap": roadmap_info
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/store_project", methods=["POST"])
def store_project():
    data = request.json
    user_id = data.get("uid")
    project = data.get("project")  
    if not user_id or not project:
        return jsonify({"error": "User ID and Project are required"}), 400
    users_collection.update_one(
        {"uid": user_id},
        {"$push": {"projects": project}}
    )
    return jsonify({"message": "Project stored successfully!"})

@app.route("/roadmaps", methods=["GET"])
def get_roadmaps():
    return jsonify(roadmaps)

with open("questions.json", "r") as f:
    questions_data = json.load(f)

@app.route("/get_questions", methods=["GET"])
def get_questions():
    subject = request.args.get("subject")
    if subject in questions_data:
        questions = questions_data[subject]
        random.shuffle(questions)  
        return jsonify({"questions": questions})
    else:
        return jsonify({"error": "Subject not found"}), 404

@app.route("/submit_answers", methods=["POST"])
def submit_answers():
    data = request.get_json()
    subject = data.get("subject")
    user_answers = data.get("answers")  
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

@app.route("/update_user_data", methods=["POST"])
def update_user_data():
    data = request.get_json()
    # print("Received Data:", data)
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    user_id = data.get("uid")
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    user = users_collection.find_one({"uid": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    try:
        updated_scores = user.get("scores", {})
        subjects=["Operating System", "DSA", "Frontend", "Backend", "Machine Learning", "Data Analytics"]
        for subject in subjects:
            if subject not in updated_scores:
                updated_scores[subject] = []
            updated_scores[subject].append(float(data['scores'][subject]*10))
            if len(updated_scores[subject]) > 3:
                updated_scores[subject] = updated_scores[subject][-3:]
        updated_projects = [
            data['formdata']["Project 1"],
            data['formdata']["Project 2"],
            data['formdata']["Project 3"],
            data['formdata']["Project 4"],
        ]
        updated_projects = [p for p in updated_projects if p]
        interest_label = data['predicted_interest']['predicted_interest']
        print("Fsd")
        updated_interests = user.get("predicted_interest")
        # updated_interests.append(interest_label)
        print(updated_scores)
        print(updated_projects)
        print(updated_interests)
        # if len(updated_interests) > 2:
        #     updated_interests = data['predicted_interest']['predicted_interest']
        updated_interests = data['predicted_interest']['predicted_interest']
        users_collection.update_one(
            {"uid": user_id},
            {"$set": {
                "scores": updated_scores,
                "projects": updated_projects,
                "predicted_interest": updated_interests,
                "roadmap":data['roadmap']
            }}
        )
        return jsonify({
            "message": "User data updated successfully",
            "latest_interest": interest_label
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
