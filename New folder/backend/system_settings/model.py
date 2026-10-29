"""Serialization helpers and defaults for the system settings document."""

DEFAULT_SETTINGS = {
    "application_name": "Internship Academy",
    "admin_email": "admin@internshipacademy.com",
    "language": "English",
    "timezone": "Asia/Kolkata",
    "maintenance_mode": False,
    "email_notifications": True,
    "two_factor_authentication": False,
}


def setting_serializer(setting) -> dict:
    return {
        "id": str(setting["_id"]),
        "application_name": setting.get("application_name", ""),
        "admin_email": setting.get("admin_email", ""),
        "language": setting.get("language", "English"),
        "timezone": setting.get("timezone", "Asia/Kolkata"),
        "maintenance_mode": setting.get("maintenance_mode", False),
        "email_notifications": setting.get("email_notifications", True),
        "two_factor_authentication": setting.get("two_factor_authentication", False),
        "updated_at": setting.get("updated_at"),
    }
