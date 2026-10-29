from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class AdminCreate(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=7, max_length=20)
    role: str
    department: str
    status: str = "Active"


class AdminUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=7, max_length=20)
    role: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None
