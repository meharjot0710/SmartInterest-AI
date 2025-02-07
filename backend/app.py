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

roadmaps = {
    "AI": {
        "description": "Start with Python and deep learning, then move to reinforcement learning and AI applications.",
        "resources": [
            {"name": "AI Roadmap", "link": "https://roadmap.sh/ai"},
            {"name": "Deep Learning Specialization", "link": "https://www.coursera.org/specializations/deep-learning"},
            {"name": "CS50 AI Course", "link": "https://cs50.harvard.edu/ai/"},
        ]
    },
    "Web Development": {
        "description": "Learn frontend and backend development with modern technologies.",
        "resources": [
            {"name": "Frontend Roadmap", "link": "https://roadmap.sh/frontend"},
            {"name": "Backend Roadmap", "link": "https://roadmap.sh/backend"},
            {"name": "Full-Stack Development Course", "link": "https://www.udemy.com/course/full-stack-web-development"},
        ]
    },
    "Machine Learning": {
        "description": "Start with Python, then dive into ML algorithms and deep learning.",
        "resources": [
            {"name": "Machine Learning Roadmap", "link": "https://roadmap.sh/ai"},
            {"name": "Andrew Ng's ML Course", "link": "https://www.coursera.org/learn/machine-learning"},
            {"name": "Deep Learning Specialization", "link": "https://www.coursera.org/specializations/deep-learning"},
        ]
    },
    "Cybersecurity": {
        "description": "Understand security concepts, penetration testing, and ethical hacking.",
        "resources": [
            {"name": "Cybersecurity Roadmap", "link": "https://roadmap.sh/cyber-security"},
            {"name": "Ethical Hacking Course", "link": "https://www.udemy.com/course/ethical-hacking/"},
            {"name": "Kali Linux Basics", "link": "https://www.kali.org/docs/"},
        ]
    },
    "Data Science": {
        "description": "Master data analysis, visualization, and machine learning techniques.",
        "resources": [
            {"name": "Data Science Roadmap", "link": "https://roadmap.sh/data-science"},
            {"name": "Python for Data Science", "link": "https://www.coursera.org/learn/python-data-analysis"},
            {"name": "Data Science Handbook", "link": "https://jakevdp.github.io/PythonDataScienceHandbook/"},
        ]
    },
    "Robotics": {
        "description": "Learn about robotic hardware, control systems, and AI in robotics.",
        "resources": [
            {"name": "Robotics Roadmap", "link": "https://www.robotshop.com/community/forum/t/robotics-learning-roadmap/70049"},
            {"name": "MIT Robotics Course", "link": "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-141-robotic-manipulation-fall-2020/"},
            {"name": "ROS (Robot Operating System) Tutorials", "link": "https://www.ros.org/"},
        ]
    },
    "Game Development": {
        "description": "Learn game design, graphics, and interactive development using Unity and Unreal Engine.",
        "resources": [
            {"name": "Game Development Roadmap", "link": "https://roadmap.sh/game-development"},
            {"name": "Unity Game Development Course", "link": "https://www.udemy.com/course/unitycourse/"},
            {"name": "Unreal Engine Learning", "link": "https://www.unrealengine.com/en-US/learn"},
        ]
    }
}


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

    # Get roadmap for the predicted interest
    roadmap_info = roadmaps.get(interest_label, {"description": "No roadmap available.", "resources": []})

    return jsonify({
        "predicted_interest": interest_label,
        "roadmap": roadmap_info
    })


if __name__ == "__main__":
    app.run(debug=True)
