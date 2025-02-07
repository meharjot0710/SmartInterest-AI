from flask import Flask, request, jsonify
from flask_cors import CORS  
import joblib
import os
import json

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

# Load model and encoders
model_path = os.path.join("model", "smartinterest_model.pkl")
label_encoder_path = os.path.join("model", "label_encoder.pkl")
roadmap_path = "roadmap_resources.json"

model = joblib.load(model_path)
label_encoder = joblib.load(label_encoder_path)

# Load roadmaps from JSON file
with open(roadmap_path, "r") as f:
    roadmaps = json.load(f)

@app.route("/predict", methods=["POST"])
def predict_interest():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    # Convert input data to model format
    input_data = [
        data["Operating System"],
        data["DSA"],
        data["Frontend"],
        data["Backend"],
        data["Machine Learning"],
        data["Data Analytics"],
        data["Project 1"],
        data["Project 2"],
        data["Project 3"],
        data["Project 4"],
    ]

    # Make prediction
    prediction = model.predict([input_data])[0]
    interest_label = label_encoder.inverse_transform([prediction])[0]

    # Get full roadmap for predicted interest
    roadmap_info = roadmaps.get(interest_label, {"description": "No roadmap available.", "levels": {}})

    return jsonify({
        "predicted_interest": interest_label,
        "roadmap": roadmap_info  # ✅ Now includes all levels
    })

@app.route("/roadmaps", methods=["GET"])
def get_roadmaps():
    """Fetch all available roadmaps."""
    return jsonify(roadmaps)

if __name__ == "__main__":
    app.run(debug=True)
