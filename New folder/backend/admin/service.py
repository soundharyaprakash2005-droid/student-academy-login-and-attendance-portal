from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId

from admin.model import admin_serializer
from admin.schema import AdminCreate, AdminUpdate
from config.database import admin_collection, activity_log_collection


def _now():
    return datetime.now(timezone.utc)


def _object_id(admin_id: str):
    try:
        return ObjectId(admin_id)
    except (InvalidId, TypeError):
        return None


def log_activity(user_name: str, action: str, module: str):
    activity_log_collection.insert_one({
        "user_name": user_name,
        "action": action,
        "module": module,
        "timestamp": _now(),
    })


def get_all_admins():
    admins = admin_collection.find({}, sort=[("created_at", -1)])
    return [admin_serializer(admin) for admin in admins]


def get_admin_by_id(admin_id: str):
    oid = _object_id(admin_id)
    if oid is None:
        return None

    admin = admin_collection.find_one({"_id": oid})
    return admin_serializer(admin) if admin else None


def create_admin(data: AdminCreate):
    admin_data = data.model_dump()
    admin_data["created_at"] = _now()
    admin_data["updated_at"] = _now()

    result = admin_collection.insert_one(admin_data)
    admin_data["_id"] = result.inserted_id

    log_activity(data.full_name, "created", "Users")
    return admin_serializer(admin_data)


def update_admin(admin_id: str, data: AdminUpdate):
    oid = _object_id(admin_id)
    if oid is None:
        return None

    update_data = data.model_dump(exclude_unset=True, exclude_none=True)
    update_data["updated_at"] = _now()

    result = admin_collection.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        return None

    updated = admin_collection.find_one({"_id": oid})
    log_activity(updated.get("full_name", "Unknown"), "updated", "Users")
    return admin_serializer(updated)


def delete_admin(admin_id: str):
    oid = _object_id(admin_id)
    if oid is None:
        return None

    admin = admin_collection.find_one({"_id": oid})
    if not admin:
        return None

    admin_collection.delete_one({"_id": oid})
    log_activity(admin.get("full_name", "Unknown"), "deleted", "Users")
    return admin_serializer(admin)
