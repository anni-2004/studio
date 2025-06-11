from database import profiles
from bson import ObjectId

def save_or_update(user_id: str, section: str, data: dict):
    """Insert new doc or update existing section"""
    existing = profiles.find_one({"user_id": user_id})
    if existing:
        profiles.update_one(
            {"user_id": user_id},
            {"$set": {section: data}}
        )
    else:
        profiles.insert_one({"user_id": user_id, section: data})

def mark_submitted(user_id: str):
    profiles.update_one(
        {"user_id": user_id},
        {"$set": {"submitted": True}}
    )
