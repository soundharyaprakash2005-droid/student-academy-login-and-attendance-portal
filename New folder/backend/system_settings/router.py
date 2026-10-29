from fastapi import APIRouter

from system_settings import service
from system_settings.schema import SystemSettingUpdate
from utils.response import success_response

router = APIRouter(prefix="/settings", tags=["System Settings"])


@router.get("/")
def get_settings():
    settings = service.get_settings()
    return success_response("Settings fetched successfully", settings)


@router.put("/")
def update_settings(settings: SystemSettingUpdate):
    updated = service.update_settings(settings)
    return success_response("Settings updated successfully", updated)
