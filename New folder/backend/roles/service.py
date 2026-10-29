from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId

from roles.model import role_serializer
from roles.schema import RoleCreate, RoleUpdate
from config.database import role_collection, activity_log_collection


def _now():
    return datetime.now(timezone.utc)


def _object_id(role_id: str):
    try:
        return ObjectId(role_id)
    except (InvalidId, TypeError):
        return None


def log_activity(user_name: str, action: str):
    activity_log_collection.insert_one({
        "user_name": user_name,
        "action": action,
        "module": "Roles",
        "timestamp": _now(),
    })


def get_all_roles():
    roles = role_collection.find({}, sort=[("created_at", 1)])
    return [role_serializer(role) for role in roles]


def get_role_by_id(role_id: str):
    oid = _object_id(role_id)
    if oid is None:
        return None

    role = role_collection.find_one({"_id": oid})
    return role_serializer(role) if role else None


def create_role(data: RoleCreate):
    role_data = data.model_dump()
    role_data["created_at"] = _now()

    result = role_collection.insert_one(role_data)
    role_data["_id"] = result.inserted_id

    log_activity(data.role_name, "created")
    return role_serializer(role_data)


def update_role(role_id: str, data: RoleUpdate):
    oid = _object_id(role_id)
    if oid is None:
        return None

    update_data = data.model_dump(exclude_unset=True, exclude_none=True)

    result = role_collection.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        return None

    updated = role_collection.find_one({"_id": oid})
    log_activity(updated.get("role_name", "Unknown"), "updated")
    return role_serializer(updated)


def delete_role(role_id: str):
    oid = _object_id(role_id)
    if oid is None:
        return None

    role = role_collection.find_one({"_id": oid})
    if not role:
        return None

    role_collection.delete_one({"_id": oid})
    log_activity(role.get("role_name", "Unknown"), "deleted")
    return role_serializer(role)
