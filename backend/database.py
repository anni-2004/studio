from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME")
if not MONGO_URI or not MONGO_DB_NAME or not MONGO_COLLECTION_NAME:
    raise Exception("MongoDB environment variables not set properly")
client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]
company_collection = db[MONGO_COLLECTION_NAME]
