"""Serialization helpers for admin documents stored in the database."""


def admin_serializer(admin) -> dict:
    return {
        "id": str(admin["_id"]),
        "full_name": admin.get("full_name", ""),
        "email": admin.get("email", ""),
        "phone": admin.get("phone", ""),
        "role": admin.get("role", ""),
        "department": admin.get("department", ""),
        "status": admin.get("status", "Active"),
        "created_at": admin.get("created_at"),
        "updated_at": admin.get("updated_at"),
    }
