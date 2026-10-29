from pydantic import BaseModel, Field
from typing import List, Optional


class RoleCreate(BaseModel):
    role_name: str = Field(..., min_length=2, max_length=60)
    description: str = Field(..., min_length=3, max_length=200)
    permissions: List[str] = []


class RoleUpdate(BaseModel):
    role_name: Optional[str] = Field(None, min_length=2, max_length=60)
    description: Optional[str] = Field(None, min_length=3, max_length=200)
    permissions: Optional[List[str]] = None
