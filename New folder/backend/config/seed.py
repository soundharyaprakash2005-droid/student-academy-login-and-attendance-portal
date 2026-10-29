"""Seed the database with sample data the first time the app runs."""

from datetime import datetime, timedelta, timezone

from config.database import (
    admin_collection,
    role_collection,
    activity_log_collection,
)


def _days_ago(days: int):
    return datetime.now(timezone.utc) - timedelta(days=days)


SAMPLE_ROLES = [
    {
        "role_name": "Admin",
        "description": "Full system access with all permissions",
        "permissions": ["Manage Users", "Manage Roles", "Manage Settings", "View Reports"],
    },
    {
        "role_name": "Mentor",
        "description": "Manage interns, review tasks and reports",
        "permissions": ["Manage Users", "View Reports"],
    },
    {
        "role_name": "Student",
        "description": "View assigned tasks and track performance",
        "permissions": ["View Reports"],
    },
]

SAMPLE_ADMINS = [
    {"full_name": "Arun Kumar", "email": "arun@gmail.com", "phone": "9876543210",
     "role": "Student", "department": "Web Development", "status": "Active"},
    {"full_name": "Priya Sharma", "email": "priya@gmail.com", "phone": "9876501234",
     "role": "Mentor", "department": "Data Science", "status": "Active"},
    {"full_name": "Rahul Verma", "email": "rahul@gmail.com", "phone": "9998877665",
     "role": "Admin", "department": "Management", "status": "Inactive"},
    {"full_name": "Sneha Reddy", "email": "sneha@gmail.com", "phone": "9123456780",
     "role": "Student", "department": "UI/UX Design", "status": "Active"},
    {"full_name": "Vikram Singh", "email": "vikram@gmail.com", "phone": "9012345678",
     "role": "Mentor", "department": "Cloud Computing", "status": "Active"},
]


def seed_database():
    if role_collection.count_documents({}) == 0:
        for index, role in enumerate(SAMPLE_ROLES):
            role["created_at"] = _days_ago(30 - index)
            role_collection.insert_one(role)

    if admin_collection.count_documents({}) == 0:
        for index, admin in enumerate(SAMPLE_ADMINS):
            admin["created_at"] = _days_ago(len(SAMPLE_ADMINS) - index)
            admin["updated_at"] = admin["created_at"]
            admin_collection.insert_one(admin)

            activity_log_collection.insert_one({
                "user_name": admin["full_name"],
                "action": "created",
                "module": "Users",
                "timestamp": admin["created_at"],
            })
