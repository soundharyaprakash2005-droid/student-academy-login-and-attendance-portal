"""Serialization helpers for role documents stored in the database."""


def role_serializer(role) -> dict:
    return {
        "id": str(role["_id"]),
        "role_name": role.get("role_name", ""),
        "description": role.get("description", ""),
        "permissions": role.get("permissions", []),
        "created_at": role.get("created_at"),
    }
