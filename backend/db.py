from pymongo import MongoClient
from urllib.parse import quote_plus

MONGO_URI = "mongodb+srv://meharjot03:anmol123@smartinterest-ai.wbrqs.mongodb.net/?retryWrites=true&w=majority&appName=SmartInterest-AI"
client = MongoClient(MONGO_URI)

db = client["smartinterest-ai"]
users_collection = db["sm"]
scores_collection = db["sm"]