from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

# Load model
model_path = os.path.join("model", "smartinterest_model.pkl")
label_encoder_path = os.path.join("model", "label_encoder.pkl")

model = joblib.load(model_path)
label_encoder = joblib.load(label_encoder_path)

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
    print(interest_label)
    return jsonify({"predicted_interest": interest_label})

if __name__ == "__main__":
    app.run(debug=True)
