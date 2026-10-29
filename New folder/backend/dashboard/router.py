from fastapi import APIRouter

from admin.model import admin_serializer
from config.database import (
    admin_collection,
    role_collection,
    activity_log_collection,
)
from utils.response import success_response

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def get_dashboard_stats():
    total_users = admin_collection.count_documents({})
    active_users = admin_collection.count_documents({"status": "Active"})
    inactive_users = admin_collection.count_documents({"status": "Inactive"})
    total_roles = role_collection.count_documents({})

    recent_users = [
        admin_serializer(admin)
        for admin in admin_collection.find({}, sort=[("created_at", -1)], limit=5)
    ]

    recent_activity = []
    for log in activity_log_collection.find({}, sort=[("timestamp", -1)], limit=6):
        recent_activity.append({
            "user_name": log.get("user_name", ""),
            "action": log.get("action", ""),
            "module": log.get("module", ""),
            "timestamp": log.get("timestamp"),
        })

    return success_response("Dashboard stats fetched successfully", {
        "total_users": total_users,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "total_roles": total_roles,
        "recent_users": recent_users,
        "recent_activity": recent_activity,
    })
