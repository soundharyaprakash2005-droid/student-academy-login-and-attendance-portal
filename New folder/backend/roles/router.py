from fastapi import APIRouter, HTTPException

from roles import service
from roles.schema import RoleCreate, RoleUpdate
from utils.response import success_response

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("/")
def get_all_roles():
    roles = service.get_all_roles()
    return success_response("Roles fetched successfully", roles)


@router.get("/{role_id}")
def get_role(role_id: str):
    role = service.get_role_by_id(role_id)
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return success_response("Role fetched successfully", role)


@router.post("/", status_code=201)
def create_role(role: RoleCreate):
    created = service.create_role(role)
    return success_response("Role created successfully", created)


@router.put("/{role_id}")
def update_role(role_id: str, role: RoleUpdate):
    updated = service.update_role(role_id, role)
    if updated is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return success_response("Role updated successfully", updated)


@router.delete("/{role_id}")
def delete_role(role_id: str):
    deleted = service.delete_role(role_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return success_response("Role deleted successfully", deleted)
