from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class SystemSettingUpdate(BaseModel):
    application_name: Optional[str] = Field(None, min_length=2, max_length=100)
    admin_email: Optional[EmailStr] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    maintenance_mode: Optional[bool] = None
    email_notifications: Optional[bool] = None
    two_factor_authentication: Optional[bool] = None
