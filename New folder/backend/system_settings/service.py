from datetime import datetime, timezone

from system_settings.model import DEFAULT_SETTINGS, setting_serializer
from system_settings.schema import SystemSettingUpdate
from config.database import system_setting_collection, activity_log_collection


def _now():
    return datetime.now(timezone.utc)


def get_settings():
    """Return the settings document, creating defaults on first access."""
    setting = system_setting_collection.find_one({})

    if setting is None:
        setting = dict(DEFAULT_SETTINGS)
        setting["updated_at"] = _now()
        result = system_setting_collection.insert_one(setting)
        setting["_id"] = result.inserted_id

    return setting_serializer(setting)


def update_settings(data: SystemSettingUpdate):
    current = get_settings()

    update_data = data.model_dump(exclude_unset=True, exclude_none=True)
    update_data["updated_at"] = _now()

    from bson import ObjectId
    system_setting_collection.update_one(
        {"_id": ObjectId(current["id"])},
        {"$set": update_data},
    )

    activity_log_collection.insert_one({
        "user_name": "Admin",
        "action": "updated",
        "module": "Settings",
        "timestamp": _now(),
    })

    return get_settings()
